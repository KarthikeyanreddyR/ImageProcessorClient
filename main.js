var _globalFile;
var _imageType;
var _api = {
    domain: 'http://localhost:8080/ImageProcessor/api'
}
let transformData = {
    image_string: null,
    transformations: []
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

function uploadFile() {
    var files = document.getElementById("myfile").files;
    if (files.length === 0) {
        return;
    }
    file = files[0];
    _globalFile = file;

    getBase64(file).then(function (data) {
        transformData.image_string = data;
        _imageType = data.substring(0, data.indexOf(",") + 1);
        $("#imageProcessor").css("display", "block");
        $("#originalImage").attr("src", data);
        //$("#transformedImage").attr("src", data);
    });
};

function download() {
    $.ajax({
        url: _api.domain + '/download',
        type: 'GET',
        data: null,
        success: function (res) {
           console.log(res);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function transform() {
    $.ajax({
        url: _api.domain + '/transform',
        type: 'POST',
        data: JSON.stringify(transformData),
        success: function (res) {
            console.log(res);
            $("#transformedImage").attr("src", _imageType + res.data.success);
            $("#download").attr("href", _imageType + res.data.success)
            transformData.image_string = _imageType + res.data.success;
            console.log(_imageType);
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
    if (e.target.checked) {
        toggle(e.target.value, "block");
        toggleTransformation(e.target.value, true);
    } else {
        toggle(e.target.value, "none");
        toggleTransformation(e.target.value, false);
    }
});

function toggle(value, toggle) {
    switch (value) {
        case "ROTATE":
            $("#rotate_params").css("display", toggle);
            break;
        case "RESIZE":
            $("#resize_params").css("display", toggle);
            break;
        default:
            break;
    }
}

function updateResizeOptions() {
    var width = Number($("#width").val());
    var height = Number($("#height").val());
    $.each(transformData.transformations, function() {
        if(this.transform_type === "RESIZE"){
            this.options.width = width;
            this.options.height = height;
        }
    });
}

function updateRotateOptions() {
    var degree = Number($("#degrees").val());
    $.each(transformData.transformations, function() {
        if(this.transform_type === "ROTATE"){
            if(this.options["degrees"] != undefined) {
                this.options.degrees = degree;
            }
        }
    });
}

function toggleTransformation(value, toggle) {
    if (toggle) {
        // add transformation
        let transform = {
            transform_type: value
        }
        switch (value) {
            case "ROTATE":
                transform.options = {
                    degrees: Number($("#degrees").val())
                }
                transformData.transformations.push(transform);
                break;
            case "ROTATE_LEFT":
                transform.transform_type = "ROTATE";
                transform.options = {
                    orientation: "LEFT"
                }
                transformData.transformations.push(transform);
                break;
            case "ROTATE_RIGHT":
                transform.transform_type = "ROTATE";
                transform.options = {
                    orientation: "RIGHT"
                }
                transformData.transformations.push(transform);
                break;
            case "RESIZE":
                transform.options = {
                    width: Number($("#width").val()),
                    height: Number($("#height").val())
                }
                transformData.transformations.push(transform);
                break;
            case "FLIP_HORIZONTAL":
                transform.transform_type = "FLIP";
                transform.options = {
                    orientation: "HORIZONTAL"
                }
                transformData.transformations.push(transform);
                break;
            case "FLIP_VERTICAL":
                transform.transform_type = "FLIP";
                transform.options = {
                    orientation: "VERTICAL"
                }
                transformData.transformations.push(transform);
                break;
            case "GRAYSCALE":
                transform.options = {};
                transformData.transformations.push(transform);
                break;
            case "THUMBNAIL":
                transform.options = {};
                transformData.transformations.push(transform);
                break;
        }
    } else {
        // remove transformation
        var arr = [];
        var oriArr = transformData.transformations;
        switch (value) {
            case "ROTATE_LEFT":
                arr = oriArr.filter(obj => {
                    if (obj.transform_type != "ROTATE") {
                        return obj;
                    } else if (obj.options.orientation != "LEFT") {
                        return obj;
                    }
                });
                break;
            case "ROTATE_RIGHT":
                arr = oriArr.filter(obj => {
                    if (obj.transform_type != "ROTATE") {
                        return obj;
                    } else if (obj.options.orientation != "RIGHT") {
                        return obj;
                    }
                });
                break;
            case "FLIP_HORIZONTAL":
                arr = oriArr.filter(obj => {
                    if (obj.transform_type != "FLIP") {
                        return obj;
                    } else if (obj.options.orientation != "HORIZONTAL") {
                        return obj;
                    }
                });
                break;
            case "FLIP_VERTICAL":
                arr = oriArr.filter(obj => {
                    if (obj.transform_type != "FLIP") {
                        return obj;
                    } else if (obj.options.orientation != "VERTICAL") {
                        return obj;
                    }
                });
                break;
            default:
                arr = oriArr.filter(obj => { return obj.transform_type != value });
                break;
        }
        transformData.transformations = arr;
    }
}
