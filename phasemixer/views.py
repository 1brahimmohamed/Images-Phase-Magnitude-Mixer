from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .image import ImageMain
from .cropped_image import CroppedImage

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

        ImageMain(
            file,
            f'{location}.jpg',
            ('mag1.jpg' if location == 'image1' else 'mag2.jpg'),
            ('phase1.jpg' if location == 'image2' else 'phase2.jpg'))

        # img1 = CroppedImage()

        return JsonResponse(
            {
                'Status': "Saved Successfully",
            }
        )
