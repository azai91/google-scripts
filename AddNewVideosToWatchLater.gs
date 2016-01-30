// Run this once to grant script access and add trigger automatically
// Automatically adds new subscription videos from youtube to watch later list (if you have email notifications for those turned on)
function AddAddNewVideosToWatchLaterTrigger()
{
  ScriptApp.newTrigger('AddNewVideosToWatchLater')
  .timeBased()
  .everyMinutes(1)
  .create();
}

function AddNewVideosToWatchLater()
{
  var regexp = new RegExp(".*/watch%3Fv%3D([^%]+)%.*", "gi");

  var threads = GmailApp.search('in:inbox is:unread from:noreply@youtube.com');
  for (var i in threads) {
    try {
      messages = threads[i].getMessages()
      for (var k in messages)
      {
        var msg = messages[k]
        if (msg.isUnread()) {
          var video_id = regexp.exec(msg.getBody());
          if (video_id != null) {
            video_id = video_id[1];
            var part= 'id';
            var details = {
              videoId: video_id,
              kind: 'youtube#video'
            };
            var resource = {
              snippet: {
                playlistId: 'WL',
                resourceId: details
              }
            };
            YouTube.PlaylistItems.insert(resource, 'snippet');
            msg.markRead()
          }
        }
      }
      threads[i].moveToArchive();
    }
    catch(e) {
      Logger.log(e.message);
    }
  }
}