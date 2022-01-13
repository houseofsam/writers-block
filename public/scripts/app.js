// Client facing scripts here

//-------------- NOTE: WHEN YOU NEED TO ACCESS DB VALUES FROM BROWSER ON CLICK ------------------------------------//
/*

1 - USING DATA ATTRIBUTE (PASSING ID FROM REQ.PARAMS > TEMPLATEVARS > EJS and then using .attr() to get the data on that element)
 $(".back-to-blocks").click(function() {
  const storyID = $('body').attr('data-story-id')
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
    .then((response) => {
      if (response.is_complete) {
        $('.add-block-btn').addClass('hidden');
      } else {
        $('.add-block-btn').removeClass('hidden');
      }
    })
    .catch((error) => {
        console.log('Error while loading story', error);
      });

    displayFullContributions();
  });

2 - USING .text() empty to get the value of the element you want, not recommended to use string to evaluate
    // if ($('#complete').text()==='(COMPLETE)')  {
      if ($('#complete').text().includes('COMPLETE')) {
        $('.add-block-btn').addClass('hidden');
      } else {
        $('.add-block-btn').removeClass('hidden');
      }

3 - USING onclick= in your html tag is like an inline onlick handler for the tag, see MERGE CONTRIBUTION BUTTON

*/
//----------------------------------------------------------------------------------------------------------------//


$(() => { //once document is loaded/ready...

//what was in document ready by itself with error

  loadStory();
  $('.back-to-blocks').addClass('hidden');

  $(".add-block-btn").click(function() {
    $(this).addClass('hidden');
    // $('.full-contribution-container').addClass('hidden');
    // $('.contribution-container').addClass('hidden');
    // $('.new-block').removeClass('hidden');
   // $('.FORM').renoveClass('hidden');
   hideFullContributions();
  });

  // $("#complete").text(response.is_complete === false ? '(IN PROGRESS)' : '(COMPLETE)')

  $(".back-to-blocks").click(function() {
    // $('.full-contribution-container').addClass('hidden');
    // $('.contribution-container').removeClass('hidden');
    // $('.add-block-btn').removeClass('hidden');
    // $('.new-block').addClass('hidden');
    // $('.back-to-blocks').addClass('hidden');
    const storyID = $('body').attr('data-story-id')
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
    .then((response) => {
      if (response.is_complete) {
        $('.add-block-btn').addClass('hidden');
      } else {
        $('.add-block-btn').removeClass('hidden');
      }
    })
    .catch((error) => {
        console.log('Error while loading story', error);
      });

    displayFullContributions();
  });

  const displayFullContributions = function () {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').removeClass('hidden');
    $('.new-block').addClass('hidden');
    $('.back-to-blocks').addClass('hidden');
  }


  const hideFullContributions = function () {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').addClass('hidden');
    $('.new-block').removeClass('hidden');
    $('.back-to-blocks').removeClass('hidden');
  }

  //   //when we click on the contribution tile
  // $(".contribution-container").click(function() {
  //   //reveal contribution content ... where contribution_id matches
  //   $('.full-contribution-container').removeClass('hidden');
  //   $('.contribution-container').addClass('hidden');
  // });

  //   //when we click on the contribution tile
  // $(".contribution-container").click(function() {
  // const contributionID = $(this).attr('data-id')
  // console.log('contributionID---->',contributionID)
  // console.log('THIS------>',this)
  //   //reveal contribution content ... where contribution_id matches
  //   $('.full-contribution-container').removeClass('hidden');
  //   if (contribution_id)
  //   $('.contribution-container').addClass('hidden');
  // });

});

//--------------------- FUNCTIONS ----------------------------------------------------------//



  const loadStory = function() {
    const storyID = $('body').attr('data-story-id')
    // $.get(`/stories/${storyID}`) //using AJAX to fetch data
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
      .then((response) => {
        //console.log('response------>', response)
        //$("#all-tweets").empty();
        //renderTweets(response);
        $("#author").text(`- ${response.author_name}`)
        $("#title").text(response.story_title)
        $("#genre").text(response.genre)
        $("#complete").text(response.is_complete === false ? '(IN PROGRESS)' : '(COMPLETE)')
        $("#story-text").text(response.story_text)
        $("#all-contributions").text(renderContributionsPreview(response.contributions))
        $("#full-contribution-view").text(renderFullContribution(response.contributions))
        $(".full-contribution-container").addClass('hidden')
        console.log('userID------>', userID)
        if (response.story_author_id === userID) {
          if (response.is_complete) {
            $(".complete-toggle").addClass('pressed-complete')
            $(".ongoing-toggle").removeClass('pressed-ongoing')
            $('.add-block-btn').addClass('hidden');
          } else {
            $(".complete-toggle").removeClass('pressed-complete')
            $(".ongoing-toggle").addClass('pressed-ongoing')
          }
          console.log('response.story_author_id', response.story_author_id)
          $("#complete").addClass('hidden')
          $(".complete-toggle").removeClass('hidden')
          $(".ongoing-toggle").removeClass('hidden')
          $("#author").addClass('hidden')
          $("#genre").addClass('hidden')

      // --------- If author, when clicking the COMPLETE button, add class
          $(".complete-toggle").click(function() {
            const storyID = $('body').attr('data-story-id')
            //console.log('storyID------>', storyID)
            $.post(`http://localhost:8080/stories/${storyID}/complete`)
            $(".complete-toggle").addClass('pressed-complete')
            $(".ongoing-toggle").removeClass('pressed-ongoing')

            //Hide 'Add a block'
            $(".add-block-btn").addClass('hidden')
            //Hide 'BLOCK FORM'
            $(".new-block").addClass('hidden')




            //Hide ---> 'Back to blocks'
            $(".back-to-blocks").addClass('hidden')

            //Hide ---> contribution container preview tiles
            $(".contribution-container").removeClass('hidden')
            $(".full-contribution-container").addClass('hidden');






          });

      //---------- If author, when clicking the ONGOING button, add class
          $(".ongoing-toggle").click(function() {
            const storyID = $('body').attr('data-story-id')
            $.post(`http://localhost:8080/stories/${storyID}/ongoing`)
            $(".complete-toggle").removeClass('pressed-complete')
            $(".ongoing-toggle").addClass('pressed-ongoing')

            //Show ---> add block
            $(".add-block-btn").removeClass('hidden')




            $(".new-block").addClass('hidden')
            //Hide ---> full preview of the spec
           // $(".contribution-container").removeClass('hidden')

            //Hide ---> 'Back to blocks'
            //$(".back-to-blocks").removeClass('hidden')

            //Show ---> contribution container IF full-contribution is hidden
            $(".contribution-container").removeClass('hidden')
            $(".full-contribution-container").addClass('hidden')



          });



          //default complete + inprogress buttons as hidden --> use  .hide/.show THEN SHOW
          //default merge button hidden, show
        }
      })
      .catch((error) => {
        console.log('Error while loading story', error);
      });
  };


  const createContributionPreviewElement = function (contribution) {
    const {
      contribution_id,
      contribution_title,
      contributor_name,
      contribution_flavour_text,
      chapter_photo,
      contribution_upvote_count
     } = contribution;

     const nameHyphen = `- ${contributor_name}`
    // console.log('nameHyphen----->', nameHyphen)
     const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
     const contributorName =`<p class="contributor-name">${nameHyphen}</p>`;
     const flavourText = `<div class="contribution-flavour">${contribution_flavour_text}</div>`;
     const upVoteCount = `<div class="upvote"> <i class="fas fa-chevron-up"></i><tag>${contribution_upvote_count}</tag> <i class="fas fa-chevron-down"></i>`

     const $contribution = $(`
     <div class="contribution-container" data-id="${contribution_id}">
     <div class="contribution-content">
     <div class="contribution-heading">
     ${contributionTitle} ${contributorName} </div> ${flavourText}</div> ${upVoteCount}</div></div>
     `)

     $($contribution).click(function() {
      const contributionID = $(this).attr('data-id')
      // console.log('contributionID---->',contributionID)
      // console.log('THIS------>',this)
      $('.full-contribution-container').addClass('hidden');
      $(`.full-contribution-container[data-id="${contributionID}"]`).removeClass('hidden');
      $('.contribution-container').addClass('hidden');
      $('.back-to-blocks').removeClass('hidden');
     })



    //   //when we click on the contribution tile
    // $(".contribution-container").click(function() {
    // const contributionID = $(this).attr('data-id')
    // console.log('contributionID---->',contributionID)
    // console.log('THIS------>',this)
    //   //reveal contribution content ... where contribution_id matches

    // });




     return $contribution;

  }

  const renderContributionsPreview = function(contributions) {
    for (let contribution of contributions) {
      const $newContribution = createContributionPreviewElement(contribution);
      $("#all-contributions").append($newContribution); //adds new contribution to the bottom of the contribution container
    }
  };

  const createFullContributionElement = function (contribution) {
    const {
      contribution_id,
      contribution_title,
      contributor_name,
      contribution_flavour_text,
      contribution_text,
      chapter_photo,
      contribution_upvote_count
     } = contribution;

     const nameHyphen = `- ${contributor_name}`
    // console.log('nameHyphen----->', nameHyphen)
     const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
     const contributorName =`<p class="contributor-name">${nameHyphen}</p>`;
     const contributionText = `<div class="contribution-text">${contribution_text}</div>`;
     const upVoteCount = `<div class="upvote" id="upvote-horizontal">
     <i class="fas fa-chevron-up">

     </i><tag>${contribution_upvote_count}</tag>
     <i class="fas fa-chevron-down"></i>
    </div>`

     const $contributionFull = $(`
     <div class="full-contribution-container" data-id="${contribution_id}">
     <div class="full-contribution-content">
     <div class="contribution-heading">
     ${contributionTitle} ${contributorName} </div> ${contributionText}<div class ="full-contribution-footer">

     </i><tag>${upVoteCount}</tag>
  </div>
     `)
     return $contributionFull;
  }

  const renderFullContribution = function(contributions) {
    for (let contribution of contributions) {
      const $newFullContribution = createFullContributionElement (contribution);
      $("#full-contribution-view").append($newFullContribution); //adds new contribution to the bottom of the contribution container
    }
  };













