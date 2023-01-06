"""
 *
 * File Name  : views.py
 * Description: Implementation of project endpoints
 * Authors     : Ibrahim Mohamed & Mahmoud Salman
 *
 """

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect

import numpy as np
import matplotlib.pyplot as plt

import json
from .image import ImageMain
from .utils import extract_magnitude_phase

# init list of objects
pictures = [ImageMain, ImageMain]


@csrf_protect
@csrf_exempt
def home(request):
    return render(request, 'home.html')


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
            pictures[0],
            pictures[1],
            canvas_one_state,
            canvas_two_state,
            canvas_one_shapes,
            canvas_two_shapes,
            mode
        )

        # Generate mixed array
        result_arr = np.real(np.fft.ifft2(np.multiply(magnitude, np.exp(1j * phase))))

        # Save result image
        plt.imsave('phasemixer/static/images/result.jpg', np.abs(result_arr), cmap='gray')

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )


@csrf_protect
@csrf_exempt
def upload(request):
    if request.method == 'POST':

        file = request.FILES['file']
        location = request.POST['location']

        # Create 2 objects from class using ternary operator
        img = ImageMain(
            file,
            f'{location}.jpg',
            ('mag1.jpg' if location == 'image1' else 'mag2.jpg'),
            ('phase1.jpg' if location == 'image2' else 'phase2.jpg'))

        # storing objects in list
        if location == 'image1':
            pictures[0] = img
        else:
            pictures[1] = img

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )
