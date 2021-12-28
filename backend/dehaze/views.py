
from django.core.files.images import ImageFile

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from dehaze.models import Results
from dehaze.serializers import ResultsSerializer
from dehaze.handlers import (
    read_image
)

from dehaze.dehaze.utils import CEP
from dehaze.dehaze.utils import DCP
from dehaze.dehaze.sharpness import img_sharpness


from PIL import Image
from io import BytesIO
import numpy as np
import cv2 as cv

import zipfile
import time
import shutil
import glob


class ResultsView(APIView):

    def queryset(self, guid):
        return Results.objects.get(pk=guid)

    def get(self, request, guid):

        try:
            record = self.queryset(guid)
            data = ResultsSerializer(record).data
            return Response(data, status=status.HTTP_200_OK)

        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            b_data = request.FILES['original'].read()
            stream = BytesIO(b_data)

            # Image read
            img = read_image(stream)
            params = request.data

            # Creating record
            record = Results.objects.create(original=params.get('original'))
            original_img_shaprness = img_sharpness(img, method='original')
            record.original_sharpness = original_img_shaprness

            # Original -> CEP
            cep_time_start = time.time()
            out = CEP().enhance_rgb(img)
            cep_time_end = time.time()

            cep_sharpness = img_sharpness(out, method="cep")
            cep_filename = f'./media/cep_{record.guid}.jpg'
            cep_filename_db = f'cep_{record.guid}.jpg'
            cv.imwrite(cep_filename, out)
            record.cep = cep_filename_db
            record.cep_sharpness = cep_sharpness
            record.cep_time = str(round(cep_time_end - cep_time_start, 2))

            # original ->DCP
            dcp_time_start = time.time()
            I = img.astype('float64')/255
            dark = DCP().DarkChannel(I, 15)
            A = DCP().AtmLight(I, dark)
            te = DCP().TransmissionEstimate(I, A, 15)
            t = DCP().TransmissionRefine(img, te)
            J = DCP().Recover(I, t, A, 0.1)
            dcp_time_end = time.time()

            dcp_sharpness = img_sharpness(J, method="dcp")

            dcp_filename = f'./media/dcp_{record.guid}.jpg'
            dcp_filename_db = f'dcp_{record.guid}.jpg'
            cv.imwrite(dcp_filename, J*255)
            record.dcp = dcp_filename_db
            record.dcp_sharpness = dcp_sharpness
            record.dcp_time = str(round(dcp_time_end - dcp_time_start, 2))

            record.save()

            return Response(ResultsSerializer(record).data, status=status.HTTP_200_OK)

        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)


class DatasetUploadView(APIView):

    def post(self, request):
        try:
            dataset_extract_path = "./static/dataset/"
            shutil.rmtree(dataset_extract_path)
            uploaded_data = request.FILES['dataset']

            with zipfile.ZipFile(uploaded_data, mode='r', allowZip64=True) as file:
                file.extractall(dataset_extract_path)

            image_files = glob.glob("./static/dataset/*/*")
            media_root = "./media/"

            record_ids = []

            for path in image_files:
                shutil.copy(path, media_root)
                file_name = path.split("\\")[-1]
                img = read_image(path)

                record = Results.objects.create(original=file_name)
                original_img_shaprness = img_sharpness(img, method='original')
                record.original_sharpness = original_img_shaprness

                # Original -> CEP
                cep_time_start = time.time()
                out = CEP().enhance_rgb(img)
                cep_time_end = time.time()

                cep_sharpness = img_sharpness(out, method="cep")
                cep_filename = f'./media/cep_{record.guid}.jpg'
                cep_filename_db = f'cep_{record.guid}.jpg'
                cv.imwrite(cep_filename, out)
                record.cep = cep_filename_db
                record.cep_sharpness = cep_sharpness
                record.cep_time = str(round(cep_time_end - cep_time_start, 2))

                # original ->DCP
                dcp_time_start = time.time()
                I = img.astype('float64')/255
                dark = DCP().DarkChannel(I, 15)
                A = DCP().AtmLight(I, dark)
                te = DCP().TransmissionEstimate(I, A, 15)
                t = DCP().TransmissionRefine(img, te)
                J = DCP().Recover(I, t, A, 0.1)
                dcp_time_end = time.time()

                dcp_sharpness = img_sharpness(J, method="dcp")

                dcp_filename = f'./media/dcp_{record.guid}.jpg'
                dcp_filename_db = f'dcp_{record.guid}.jpg'
                cv.imwrite(dcp_filename, J*255)
                record.dcp = dcp_filename_db
                record.dcp_sharpness = dcp_sharpness
                record.dcp_time = str(round(dcp_time_end - dcp_time_start, 2))

                record.save()

                record_ids.append(record.guid)

            fetched_records = Results.objects.filter(guid__in=record_ids)

            return Response(ResultsSerializer(fetched_records, many=True).data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
