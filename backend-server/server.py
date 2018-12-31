import io
import threading

from flask import Flask, send_file, request, render_template
from apscheduler.schedulers.background import BackgroundScheduler
from gphoto2 import GPhoto2Error

from camera import CameraConnector

app = Flask(__name__, static_url_path='/assets', static_folder='frontend/assets', template_folder='frontend/templates')

camera = CameraConnector()

'''
@app.before_first_request
def initialize():
    scheduler = BackgroundScheduler()
    scheduler.start()

    scheduler.add_job(camera.check_files, 'interval', seconds=10)
'''

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/preview/<path:timestamp>")
def get_preview(timestamp):
    image_binary_data = camera.get_preview()

    return send_file(
        io.BytesIO(image_binary_data),
        mimetype='image/jpeg')

@app.route("/capture")
def capture_button():
    return render_template('capture.html')

@app.route("/take_photo", methods=['GET', 'POST'])
def take_photo():
    camera.take_photo()
    return 'Success', 200

app.run(host='0.0.0.0', port=8097)
