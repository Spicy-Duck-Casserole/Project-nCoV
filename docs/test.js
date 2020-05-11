// 数据源
url = 'https://raw.githubusercontent.com/Penguint/Project-nCoV-server/master/test.json'

// 获取数据
var obj
$.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (response) {
        obj = response

        // 显示数据
        $(".container").html(formatJson(JSON.stringify(obj)))
    }
});
