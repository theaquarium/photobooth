from __future__ import print_function

from datetime import datetime
import logging
import os
import sys
import time

import gphoto2 as gp

from send_file import send_file

class CameraConnector:
    def __init__(self):
        self.PHOTO_DIR = os.path.expanduser('~/Documents/photobooth/backend-server/photos')
        self.file_cache = None
        logging.basicConfig(
            format='%(levelname)s: %(name)s: %(message)s', level=logging.WARNING)
        gp.check_result(gp.use_python_logging())
        self.camera = gp.check_result(gp.gp_camera_new())
        gp.check_result(gp.gp_camera_init(self.camera))
        gp.check_result(gp.gp_camera_capture_preview(self.camera))
        self.use_cached = False

    def get_preview(self):
        if self.use_cached is False:
            try:
                camera_file = gp.check_result(gp.gp_camera_capture_preview(self.camera))
            except gp.GPhoto2Error:
                camera_file = self.file_cache
        else:
            camera_file = self.file_cache
        
        if camera_file is None:
            camera_file = gp.check_result(gp.gp_camera_capture_preview(self.camera))

        self.file_cache = camera_file
        file_data = gp.check_result(gp.gp_file_get_data_and_size(camera_file))

        return file_data
    
    def take_photo(self):
        print('Capturing image')

        self.use_cached = True

        gp.check_result(gp.gp_camera_exit(self.camera))
        self.camera = gp.check_result(gp.gp_camera_new())
        gp.check_result(gp.gp_camera_init(self.camera))

        file_path = gp.check_result(gp.gp_camera_capture(
            self.camera, gp.GP_CAPTURE_IMAGE))

        info = gp.check_result(
            gp.gp_camera_file_get_info(self.camera, file_path.folder, file_path.name))
        timestamp = info.file.mtime
        timestamp_str = 't' + str(timestamp)
        file_name_split = file_path.name.split('.')
        file_name_split.insert(1, timestamp_str)
        file_name = '.'.join(file_name_split)
        target = os.path.join(self.PHOTO_DIR, file_name)
        if not os.path.isdir(self.PHOTO_DIR):
                os.makedirs(self.PHOTO_DIR)
        camera_file = gp.check_result(gp.gp_camera_file_get(
            self.camera, file_path.folder, file_path.name, gp.GP_FILE_TYPE_NORMAL))
        gp.check_result(gp.gp_file_save(camera_file, target))
        send_file(target)

        self.use_cached = False

    def __del__(self):
        gp.check_result(gp.gp_camera_exit(self.camera))
        
