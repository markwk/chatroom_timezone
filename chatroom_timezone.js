(function ($) {
    
    Drupal.behaviors.chatroom_timezone = {
        attach: function(context, settings) {
            $(".chatroom-message-date").each(function(index){
                var time = $(this).html();
                var time_array = time.split(':');
                var hh_ofset = Drupal.settings.chatroom_timezone.user_timezone_offset_hour;
                var mm_ofset = Drupal.settings.chatroom_timezone.user_timezone_offset_min;
            
                time_array[0] = parseInt(time_array[0]) + hh_ofset;
                time_array[1] = parseInt(time_array[1]) + mm_ofset;
            
                if(time_array[0] > 12) {
                    time_array[0] = time_array[0] - 12;
                }
                if(time_array[0] < 0) {
                    time_array[0] = Math.abs(time_array[0]);
                }

                time_array[0] = sumUpTime(time, Drupal.settings.chatroom_timezone.user_timezone_offset_hour.toString() 
                    +':'+ Drupal.settings.chatroom_timezone.user_timezone_offset_min.toString()).hh;
            
                time_array[1] = sumUpTime(time, Drupal.settings.chatroom_timezone.user_timezone_offset_hour.toString() 
                    +':'+ Drupal.settings.chatroom_timezone.user_timezone_offset_min.toString()).mm;
                $(this).html(time_array.join(':'));
            });
        }
    };
    
    
    Drupal.Nodejs.callbacks.chatroomTimezoneRewritingHandler = {
        callback: function (message) {
            var time = $("#chatroom-board-"+ message.data.cid +" .chatroom-message-date").last().html();
            var time_array = time.split(':');
            
            var hh_ofset = Drupal.settings.chatroom_timezone.user_timezone_offset_hour;
            var mm_ofset = Drupal.settings.chatroom_timezone.user_timezone_offset_min;
            
            time_array[0] = parseInt(time_array[0]) + hh_ofset;
            time_array[1] = parseInt(time_array[1]) + mm_ofset;
            
            if(time_array[0] > 12) {
                time_array[0] = time_array[0] - 12;
            }
            if(time_array[0] < 0) {
                time_array[0] = Math.abs(time_array[0]);
            }

            time_array[0] = sumUpTime(time, Drupal.settings.chatroom_timezone.user_timezone_offset_hour.toString() 
                +':'+ Drupal.settings.chatroom_timezone.user_timezone_offset_min.toString()).hh;
            
            time_array[1] = sumUpTime(time, Drupal.settings.chatroom_timezone.user_timezone_offset_hour.toString() 
                +':'+ Drupal.settings.chatroom_timezone.user_timezone_offset_min.toString()).mm;
            $("#chatroom-board-"+ message.data.cid +" .chatroom-message-date").last().html(time_array.join(':'));
        }
    };
    
})(jQuery);

function sumUpTime(t1, t2) {
    //	sum up HH:MM + HH:MM
    var d1 = new Date(0);
    var d12 = new Date(0)
    var d2 = new Date(0);
	
    d1.setHours(parseTime(t1).hh);
    d1.setMinutes(parseTime(t1).mm);
	
    d12.setHours(0);
		
    d2.setHours(parseTime(t2).hh);
    d2.setMinutes(parseTime(t2).mm);
	
    // .getTime - number of milliseconds since 1970
    var result = d1.getTime() - d12.getTime() + d2.getTime();
	
    // make date object from milliseconds
    var newDate = new Date(result);

    var hh = "" + newDate.getHours();
    var mm = "" + newDate.getMinutes();
	
    if(hh.length < 2) hh = "0" + hh;
    if(mm.length < 2) mm = "0" + mm;
	
    return {
        hh:hh,
        mm:mm
    }
}

function parseTime(value) {
    // parse time HH:MM
    var time = value.split(":");
    return {
        hh: time[0], 
        mm: time[1]
        };
}