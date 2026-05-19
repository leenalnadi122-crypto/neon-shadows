import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORSح
import google.generativeai as genai
import tempfile
from yt_dlp import YoutubeDL
import base64
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Gemini API Key
API_KEY = "AIzaSyDvUm8r_xBTb22LBB8geAc4syU1nzPTk_U"

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

# Flask app (serve frontend from "fronted" folder)
app = Flask(__name__, static_folder='fronted')
CORS(app)

# Middleware for logging
@app.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    if request.form:
        logger.info(f"Form keys: {list(request.form.keys())}")
    if request.files:
        logger.info(f"File keys: {list(request.files.keys())}")
    if request.is_json:
        try:
            logger.info(f"JSON keys: {list(request.json.keys()) if request.json else []}")
        except Exception as e:
            logger.error(f"Error reading JSON: {e}")

# -------- Serve frontend --------
@app.route('/')
def serve_index():
    """Serve the index.html page"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files like CSS, JS, images"""
    return send_from_directory(app.static_folder, path)

# -------- Video Handling --------
def save_base64_video(base64_data, filename="video.mp4"):
    """Convert base64 string to video file"""
    try:
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]
        video_bytes = base64.b64decode(base64_data)
        temp_dir = tempfile.gettempdir()
        video_path = os.path.join(temp_dir, filename)
        with open(video_path, 'wb') as f:
            f.write(video_bytes)
        logger.info(f"Base64 video saved to: {video_path}")
        return video_path
    except Exception as e:
        logger.error(f"Error saving base64 video: {e}")
        raise

@app.route('/summarize', methods=['POST'])
def summarize_video():
    temp_dir = tempfile.gettempdir()
    video_path = None
    try:
        logger.info("=== Starting video summarization ===")
        video_source = None

        if 'video' in request.files and request.files['video'].filename:
            logger.info("Processing uploaded file")
            video_file = request.files['video']
            video_path = os.path.join(temp_dir, video_file.filename)
            video_file.save(video_path)
            video_source = "file_upload"

        elif 'video_url' in request.form and request.form['video_url']:
            logger.info("Processing video URL from form")
            video_url = request.form['video_url']
            video_source = "url_form"
            ydl_opts = {
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'outtmpl': os.path.join(temp_dir, '%(id)s.%(ext)s'),
            }
            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                video_path = ydl.prepare_filename(info)

        elif request.is_json and request.json:
            json_data = request.json
            logger.info(f"Processing JSON data with keys: {list(json_data.keys())}")

            if 'video_data' in json_data:
                logger.info("Processing base64 video data")
                video_path = save_base64_video(json_data['video_data'])
                video_source = "base64_json"

            elif 'video_url' in json_data and json_data['video_url']:
                logger.info("Processing video URL from JSON")
                video_url = json_data['video_url']
                video_source = "url_json"
                ydl_opts = {
                    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                    'outtmpl': os.path.join(temp_dir, '%(id)s.%(ext)s'),
                }
                with YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(video_url, download=True)
                    video_path = ydl.prepare_filename(info)

        if not video_path:
            error_msg = {
                'error': 'No video data found',
                'request_info': {
                    'content_type': request.content_type,
                    'has_files': bool(request.files),
                    'has_form': bool(request.form),
                    'has_json': request.is_json,
                }
            }
            logger.error(f"No video data found: {error_msg}")
            return jsonify(error_msg), 400

        logger.info(f"Video processed successfully from source: {video_source}")
        logger.info(f"Video file path: {video_path}")

        # Send request to Gemini
        prompt = """
        بناءً على هذا الفيديو:
        - لخص المحتوى في فقرة واحدة.
        - استخرج أهم 5 كلمات مفتاحية على شكل قائمة.
        - حدد الخط الزمني (timeline) بتقسيمه إلى مقدمة، عرض، وخاتمة مع وصف موجز لكل جزء.
        اجعل الإجابة باللغة العربية.
        """
        video_to_send = genai.upload_file(path=video_path)
        response = model.generate_content([prompt, video_to_send])
        summary_result = response.text

        if os.path.exists(video_path):
            os.remove(video_path)
        genai.delete_file(video_to_send.name)

        return jsonify({
            'summary_result': summary_result,
            'video_source': video_source,
            'status': 'success'
        }), 200

    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
        return jsonify({'error': str(e)}), 500

# -------- Health Check --------
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'api_configured': bool(API_KEY)
    }), 200

# -------- Debug Endpoint --------
@app.route('/debug-request', methods=['POST'])
def debug_request():
    return jsonify({
        'method': request.method,
        'content_type': request.content_type,
        'headers': dict(request.headers),
        'form_keys': list(request.form.keys()),
        'file_keys': list(request.files.keys()),
        'has_json': request.is_json,
        'json_keys': list(request.json.keys()) if request.is_json and request.json else []
    })

if __name__ == '__main__':
    logger.info("Starting Flask application with enhanced monitoring")
    app.run(debug=True)
