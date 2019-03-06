var _globalFile;
var _api = {
    domain : 'http://localhost:8080/ImageProcessor/api'
}
var uploadFile = function (files) {
    var files = document.getElementById("myfile").files;
    console.log(files);
    if (files.length === 0) {
        return;
    }
    file = files[0];
    _globalFile = file;
    var formData = new FormData();
    formData.append("file", file);
    $.ajax({
        url: _api.domain + '/uploadImage',
        type: 'POST',
        data: formData,
        success: function (data) {
            console.log(data);
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#imageProcessor").css('display', 'inline');
                $('#originalImage').attr('src', e.target.result);
                $('#transformedImage').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        },
        cache: false,
        contentType: false,
        processData: false
    });
};

var grayscale = function () {
    $.ajax({
        url: _api.domain + '/transform/grayscale',
        type: 'POST',
        data: null,
        success: function (res) {
            console.log(res);
            console.log(_globalFile);
            $('#transformedImage').attr('src', 'data:' + _globalFile.type + ';base64,' + res.data.success);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

var flipHorizontal = function () {
    $.ajax({
        url: _api.domain + '/transform/flip/horizontal',
        type: 'POST',
        data: null,
        success: function (res) {
            console.log(res);
            $('#transformedImage').attr('src', 'data:' + _globalFile.type + ';base64,' + res.data.success);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

var flipVertical = function () {
    $.ajax({
        url: _api.domain + '/transform/flip/vertical',
        type: 'POST',
        data: null,
        success: function (res) {
            console.log(res);
            $('#transformedImage').attr('src', 'data:' + _globalFile.type + ';base64,' + res.data.success);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}


