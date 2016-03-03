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

//根据所触发的事件,找到对应的上层表格行DOM元素
var findTr = function(event){

    var target = event.srcElement || event.target; //srcElement is only available in IE. In all other browsers it is event.target
    // event.target:The DOM element that initiated the event
    var $target = $(target);
    var $tr = $target.parents('tr'); //Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.千万不要和parent混了
    //console.log($tr);
    //html的表格元素，table row，表示表格的一行
    return $tr;
};

//删除对应表格行
var remove = function(event){
    var $tr = findTr(event);
    var id = $tr.data('id'); //Return the value at the named data store for the first element in the jQuery collection, as set by data(name, value) or by an HTML5 data-* attribute.

    //console.log('in remove');
    $.ajax({  //Perform an asynchronous HTTP (Ajax) request
        url:'/api/articles/' + id,
        type:'DELETE',
        success: function(data, status, xhr){
            $('.alert').addClass('hidden');
            $tr.remove();
            //console.log('remove sucess');
        }
    });
};

//更新对应行
var update = function(event){
    var $tr = findTr(event);
    $tr.find('button').attr('disabled', 'disabled');
    //console.log('in update');
    var data = {
      published: $tr.hasClass('unpublished')
    };
    var id = $tr.attr('data-id');
    $.ajax({
        url: 'api/articles/' + id,
        type:'PUT',
        contentType:'application/json',
        data:JSON.stringify({article:data}),//编辑后的要更新的数据
        success: function(dataResponse, status, xhr){
            $tr.find('button').removeAttr('disabled');
            $('.alert').addClass('hidden');
            if(data.published){
                $tr.removeClass('unpublished').find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
            }else{
                $tr.addClass('unpublished').find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
            }
        }
    });
};

$(document).ready(function(){
    var $element = $('.admin tbody');
    $element.on('click','button.remove',remove);
    $element.on('click','button',update);
    //console.log('this is ready');
});