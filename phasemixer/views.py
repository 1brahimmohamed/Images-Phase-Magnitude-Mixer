from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from PIL import Image




@csrf_protect
@csrf_exempt
def home(request):
    return render(request, 'Home.html')



@csrf_protect
@csrf_exempt
def test(request):
    if request.method == 'POST':
        file = request.FILES['file']
        img = Image.open(file)
        img.save("phasemixer/static/images/image.png")

        return JsonResponse(
            {
                'Status': "Success",
            }
        )



