function getMessage(a, b){
    var message = '';
    var sumOfRedDots = 0;
    var totalArtefactSquare = 0;
    var aIsArray = Array.isArray(a);
    var bIsArray = Array.isArray(b);

    if (typeof a === 'boolean'){
        if (a == true){
            message = 'Переданное GIF-изображение анимировано и содержит ' + b +' кадров';
        }
        else{
            message = 'Переданное GIF-изображение не анимировано';
        }
    }
    else if (typeof a === 'number'){
        message = 'Переданное SVG-изображение содержит ' + a + 'объектов и  ' + b * 4 + 'атрибутов';
    }

    else if (aIsArray == true && bIsArray == false){
        for ( var ia = 0; ia < a.length; ia++){
            sumOfRedDots = sumOfRedDots + a[ia];
        }
        message = 'Количество красных точек во всех строчках изображения: ' + sumOfRedDots;
    }

    else if (aIsArray == true && bIsArray == true){
        for ( var ia = 0, ib = 0; ia < a.length; ia++){

            totalArtefactSquare = totalArtefactSquare + (a[ia] * a[ib]);
            ib++;
        }
        message = 'Общая площадь артефактов сжатия: ' + totalArtefactSquare + 'пикселей';
    }

    return message;
}