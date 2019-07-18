$(document).ready(function() {

  $(".save-btn").on("click", function(event) {
    var newSavedArticle = $(this).data();
    newSavedArticle.saved = true;
    console.log("saved was clicked");
    var id = $(this).attr("data-articleid");
    $.ajax("/saved/" + id, {
      type: "PUT",
      data: newSavedArticle
    }).then(
      function(data) {
        location.reload();
      }
    );
  });

  $(".scrape-new").on("click", function(event) {
    event.preventDefault();
    $.get("/scrape", function(data) {
      window.location.reload();
    });
  });

  $(".unsave-btn").on("click", function(event) {
    var newUnsavedArticle = $(this).data();
    var id = $(this).attr("data-articleid");
    newUnsavedArticle.saved = false;
    $.ajax("/saved/" + id, {
      type: "PUT",
      data: newUnsavedArticle
    }).then(
      function(data) {
        location.reload();
      }
    );
  });

  function createModalHTML(data) {
    $("#note-modal-title").text("Leave a Note for Article: " + data.title);
    var noteItem;
    var noteDeleteBtn;
    console.log("data notes length ", data.notes.length)
    for (var i = 0; i < data.notes.length; i++) {
      noteItem = $("<li>").text(data.notes[i].body);
      noteItem.addClass("note-item-list");
      noteItem.attr("id", data.notes[i]._id);
      noteDeleteBtn = $("<button> Delete </button>").addClass("btn btn-danger delete-note-modal ml-4");
      noteDeleteBtn.attr("data-noteId", data.notes[i]._id);
      noteItem.append(noteDeleteBtn, " ");
      $(".notes-list").append(noteItem);
    }
  }

  $(".note-modal-btn").on("click", function(event) {
    var articleId = $(this).attr("data-articleId");
    $("#add-note-modal").attr("data-articleId", articleId);
    $("#note-modal-title").empty();
    $(".notes-list").empty();
    $("#note-body").val("");
    $.ajax("/notes/article/" + articleId, {
      type: "GET"
    }).then(
      function(data) {
        createModalHTML(data);
      }
    );

    $("#add-note-modal").modal("toggle");
  });

  $(".note-save-btn").on("click", function(event) {
    event.preventDefault();
    var articleId = $("#add-note-modal").attr("data-articleId")
    var newNote = {
      body: $("#note-body").val().trim()
    }
    console.log(newNote);
    $.ajax("/submit/" + articleId, {
      type: "POST",
      data: newNote
    })
  });

  $(document).on("click", ".delete-note-modal", function(event) {
    var noteID = $(this).attr("data-noteId");

    $.ajax("/notes/" + noteID, {
      type: "GET"
    }).then(
      function(data) {
        $("#" + noteID).remove();
      })
  });

});