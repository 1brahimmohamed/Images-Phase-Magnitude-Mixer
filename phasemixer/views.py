from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .image import ImageMain
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageEnhance

pictures = [None, None]


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

        magnitude, phase = extract_magnitude_phase(
            canvas_one_state,
            canvas_two_state,
            canvas_one_shapes,
            canvas_two_shapes,
            mode
        )

        plt.imsave('phasemixer/static/images/magnitude.png', (np.log(np.abs(magnitude+0.01))), cmap='gray')
        plt.imsave('phasemixer/static/images/phaseeee.png', phase, cmap='gray')

        result_arr = np.real(np.fft.ifft2(np.multiply(magnitude, np.exp(1j * phase))))
        # result_arr = np.where((255 - result_arr) < 100, 255, result_arr + 20)

        # save image
        plt.imsave('phasemixer/static/images/result.jpg', np.abs(result_arr), cmap='gray')

        # increase brightness of image
        # result_img = Image.open("phasemixer/static/images/result.jpg").convert('L')
        # enhancer = ImageEnhance.Brightness(result_img)
        # factor = 1.5  # brightens the image
        # result_img = enhancer.enhance(factor)
        # result_img.save('phasemixer/static/images/result.jpg', mode='L')

        return JsonResponse(
            {
                'Status': "Saved Successfully",
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

        print(file)
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


def extract_magnitude_phase(c1_state, c2_state, c1_shapes, c2_shapes, mode):
    magnitude = None
    phase = None

    if not c1_state == 'disabled' and not c2_shapes == 'disabled':
        if c1_state == 'phase':
            phase = pictures[0].crop_img('phase', c1_shapes, mode)
            magnitude = pictures[1].crop_img('magnitude', c2_shapes, mode)

        elif c1_state == 'magnitude':
            magnitude = pictures[0].crop_img('magnitude', c1_shapes, mode)
            phase = pictures[1].crop_img('phase', c2_shapes, mode)

    if c1_state == 'disabled':
        if c2_state == 'magnitude':
            magnitude = pictures[1].crop_img('magnitude', c2_shapes, mode)
            phase = np.ones(magnitude.shape)
        else:
            phase = pictures[1].crop_img('phase', c2_shapes, mode)
            magnitude = np.ones(phase.shape)

    if c2_state == 'disabled':
        if c1_state == 'magnitude':
            magnitude = pictures[0].crop_img('magnitude', c1_shapes, mode)
            phase = np.ones(magnitude.shape)
        else:
            phase = pictures[0].crop_img('phase', c1_shapes, mode)
            magnitude = np.ones(phase.shape)

    if c1_state == 'disabled' and c2_state == 'disabled':
        magnitude = np.ones((1000, 1000))
        phase = np.ones((1000, 1000))

    return magnitude, phase
