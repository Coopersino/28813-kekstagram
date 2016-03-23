function getMessage(a, b){
    var message = "";
    var type = typeof(a);
    var sum = 0;
    var square = 0;
    var ia = 0;
    var ib = 0;
    var aIsArray = Array.isArray(a);
    var bIsArray = Array.isArray(b);

    if(type === "boolean"){
        if(a == true){
            message = "Переданное GIF-изображение анимировано и содержит " + b +" кадров";
        }
        else{
            message = "Переданное GIF-изображение не анимировано";
        }
    }
    else if(type === "number"){
        message = "Переданное SVG-изображение содержит " + a + " объектов и  " + b * 4 + "атрибутов";
    }

    else if(aIsArray == true && bIsArray == false){
        for(ia = 0; ia < a.length; ia++){
            sum = sum + a[ia];
        }

        message = "Количество красных точек во всех строчках изображения: " + sum;
    }

    else if(aIsArray == true && bIsArray == true){
        for(ia = 0; ia < a.length; ia++){
            
            square = square + (a[ia] * a[ib]);
            ib++;
        }
        message = "Общая площадь артефактов сжатия: " + square + "пикселей";
    }

    return message;
}