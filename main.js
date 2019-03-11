var _globalFile;
var _api = {
    domain: 'http://localhost:8080/ImageProcessor/api'
}
let transformData = {
    imageAsBase64String: null,
    transformations: null
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let encoded = reader.result; //.replace("data:", "").replace(/^.*;base64,/, "");
            // if ((encoded.length % 4) > 0) {
            //     encoded += '='.repeat(4 - (encoded.length % 4));
            // }
            resolve(encoded);
        };
        reader.onerror = error => reject(error);
    });
}

var uploadFile = function (files) {
    var files = document.getElementById("myfile").files;
    console.log(files);
    if (files.length === 0) {
        return;
    }
    file = files[0];
    _globalFile = file;

    getBase64(file).then(function (data) {
        transformData.imageAsBase64String = data;
        $("#imageProcessor").css("display", "block");
        $("#originalImage").attr("src", data);
        $("#transformedImage").attr("src", data);
    });
};

function transform1() {
    console.log($("#transformations_form"))
}

function transform() {
    console.log(transformData);
    $.ajax({
        url: _api.domain + '/transform',
        type: 'POST',
        data: JSON.stringify(transformData),
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        },
        cache: false,
        contentType: false,
        processData: false,
        contentType: "application/json;charset=UTF-8"
    });
}

$(document).on('change', '#chkbx', function (e) {
    console.log(e);
    if (e.target.checked) {
        toggle(e.target.value, "block");        
    } else {
        toggle(e.target.value, "none");    
    }
});

function toggle(value, toggle) {
    switch (value) {
        case "FLIP":
            console.log("flip");
            $("#flip_params").css("display", toggle);
            break;
        case "ROTATE":
            console.log("rotate")
            $("#rotate_params").css("display", toggle);
            break;
        case "RESIZE":
            console.log("resize")
            $("#resize_params").css("display", toggle);
            break;
        default:
            break;
    }
}
