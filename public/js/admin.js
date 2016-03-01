/**
 * Created by nickchu on 16/3/2.
 */

$.ajaxSetup({   //Set default values for future Ajax requests.
    xhrFields:{withCredentials:true},  //An object of fieldName-fieldValue pairs to set on the native XHR object. For example, you can use it to set withCredentials to true for cross-domain requests if needed.
    error:function(xhr, status, error){ //如果出现错误,就把layout.jade中的alert显形,并显示出现的是什么错误
        $('.alert').removeClass('hidden');
        $('.alert').html("Status: " + status + ", error: " + error);
    }
});

var findTr = function(event){

    var target = event.srcElement || event.target; //srcElement is only available in IE. In all other browsers it is event.target
    // event.target:The DOM element that initiated the event
    var $target = $(target);
    var $tr = $target.parent('tr'); //Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
    ////html的表格元素，table row，表示表格的一行
    return $tr;
};