$(function(){

    // storing reference to buttons
    const $btnSaveArticle = $('.btnSaveArticle');
    const $btnComment = $('.btncomment');
    const $btnDelete = $('.btndelete');
    const $btnDelComment = $(".delComment");
    const $btnSubmitComment = $('#submitComment');

    //binding click event to delete button
    $('#commentsList').on('click' , '.delComment' , function(){
       var commentDIV = $(this).parent();
       var commentId = $(this).parent().data('id');
       var articleId = $("#articleID").text();

       $.ajax({
         method: 'DELETE',
         url: `/delcomments/${articleId}/${commentId}`
       })
        .done(function(data){
          commentDIV.remove();
        })
        .fail(function(data){
          $("#exampleModalLabel").text("News Scraper - Comments on Article");
          $("#exampleModalBody").html("<h5>There was an error deleting comment. Please try again later.</h5>");
          $("#exampleModal").modal("show");
        });
    });

    //binding click event to submit comment button
    $btnSubmitComment.on('click' , function(){
       var commentData = {
        id:$('#articleID').text(),
        username: $('#username').val().trim(),
        commentDesc: $('#commentDesc').val().trim()
      };

      $("#username").val("");
      $("#commentDesc").val("");

       $.ajax({method:'POST', url: '/submitcomments' , data:commentData})
        .done(function(data){
          $commentUC = $("<div>");
          $commentUC.addClass("commentList");
          $commentUC.attr("data-id", data.comments[data.comments.length-1]._id);
          $commentUC.html
          (`
          <button class='btn btn-danger delComment'>x</button>   
          <h6 style='max-height:100%; font-size:0.8rem;'>${commentData.username} : ${commentData.commentDesc}</h6>
          `);
          $("#commentsList").prepend($commentUC);
        })
        .fail(function(data){
          $("#exampleModalLabel").text("News Scraper - Comments on Article");
          $("#exampleModalBody").html("<h5>There was an error saving comment. Please try again later.</h5>");
          $("#exampleModal").modal("show");
        });
    });

    //binding click event to comment button
    $btnComment.on('click' , function(){
       let id = $(this).data('id');
       
       $.ajax({ method: "GET", url: `/getcomments/${id}` })
         .done(function(data) {
           $("#commentsModalLabel").text("News Scraper - Comments on Article");  
           $('#commentArticleHeadline').text(data.headline);
           $('#articleID').text(data._id);
           $("#commentsList").html('');

           data.comments.forEach(comment => {
             $commentUC = $('<div>');
             $commentUC.addClass('commentList');
             $commentUC.attr('data-id' , comment._id);
             $commentUC.html(`
             <button class='btn btn-danger delComment'>x</button>
             <h6 style='max-height:100%; font-size: 0.8rem;'>${comment.username} : ${comment.commentDesc}</h6>
             `);
             $('#commentsList').prepend($commentUC);
           });

      
           $("#commentsModal").modal("show");
         })
         .fail(function(data) {
           $("#exampleModalLabel").text("News Scraper - Comments on Article");  
           $("#exampleModalBody").html("<h5>There was an error fetching comments. Please try again later.</h5>");
           $("#exampleModal").modal("show");
         });
    });


    //binding click event to delete article buttons
    $btnDelete.on('click' , function(){
        let url = $(this).data('url');
        
        $.ajax({
          method: 'POST',
          url: "/deletethearticle",
          data: {url:url}
        })
          .done(function(data) {
            $('#exampleModalLabel').text('News Scraper - Delete Article');  
            $("#exampleModalBody").html("<h5>Article was deleted successfully.</h5>");
            $("#exampleModal").modal("show");
          })
          .fail(function(data) {
            $("#exampleModalLabel").text("News Scraper - Delete Article");    
            $("#exampleModalBody").html("<h5>There was an error in deleting Article. Please try again later.</h5>");
            $("#exampleModal").modal("show");
          });
    });

    // binding click event to save article buttons
    $btnSaveArticle.on('click' , function() {
        let $articleDiv = $(this).parent();
        
        let headline = $articleDiv.find('h3').text();
        let summary = $articleDiv.find('p').text();
        let url = $articleDiv.find('a').attr('href');

        let articledata = {
            headline: headline,
            summary: summary,
            url: url
        };

        // saving article to database using AJAX
        $.ajax({
          method: 'POST',
          url: '/savethearticle',
          data: articledata
        }).done(function(data){
             $('#modalSaveArticle').html('<h5>Article was saved successfully. Feel free to leave comments on the saved article.</h5>');
             $("#exampleModal").modal("show"); 
        }).fail(function(data){
            $("#modalSaveArticle").html("<h5>There was an error in saving Article. Please make sure the article is not already saved.</h5>");
            $('#exampleModal').modal('show');
        });
    });

    // binding click event to close button on delete article modal
    $('#btndelclose').on('click' , function(){
        location.reload();
    });
});