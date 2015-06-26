/**
 * Created by dmarjanovic on 6/26/2015.
 */
$(document).ready(function(){
  $('[data-toggle_button]').on('click',function(){
    $('#ssl_info_text').toggle();
    $('.arrow-down').toggle();
    $('.arrow-up').toggle();
  })
})
