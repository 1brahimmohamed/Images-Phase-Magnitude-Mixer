from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .image import ImageMain
import numpy as np
import matplotlib.pyplot as plt

pictures = [1, 2]


@csrf_protect
@csrf_exempt
def home(request):
    return render(request, 'home.html')


@csrf_protect
@csrf_exempt
def test(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        print(req['canvasOneShapes'])
        print('-' * 50, 'Can 2', '-' * 50)
        print(req['canvasTwoShapes'])
        print('-' * 50, 'req end', '-' * 50)
        print(req['mode'])
        print(req['phase'])
        return JsonResponse({'success': 'ok'})


@csrf_protect
@csrf_exempt
def generate_result(request):
    if request.method == 'POST':
        req = json.loads(request.body)

        mode = req['mode']
        canvas_one_state = req['canvasOneState']
        canvas_two_state = req['canvasTwoState']
        canvas_one_shapes = req['canvasOneShapes']
        canvas_two_shapes = req['canvasTwoShapes']


        mix1 = pictures[0].crop_img('magnitude', canvas_one_shapes, mode)
        mix2 = pictures[1].crop_img('phase', canvas_two_shapes, mode)
        result_arr = np.real(np.fft.ifft2(np.multiply(mix1, np.exp(1j * mix2))))
        plt.imsave('phasemixer/static/images/result.jpg', np.abs(result_arr), cmap='gray')

        return JsonResponse(
            {
                # "pictureOneURL": pictures[0].img_url,
                # "pictureTwoURL": pictures[1].img_url,
                'llol': ''
            }
        )


@csrf_protect
@csrf_exempt
def upload(request):
    if request.method == 'POST':
        global picture_1
        global picture_2

        file = request.FILES['file']
        location = request.POST['location']

        img = ImageMain(
            file,
            f'{location}.jpg',
            ('mag1.jpg' if location == 'image1' else 'mag2.jpg'),
            ('phase1.jpg' if location == 'image2' else 'phase2.jpg'))

        if location == 'image1':
            pictures[0] = img
        else:
            pictures[1] = img

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )
