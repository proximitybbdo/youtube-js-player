# YouTubePlayer / YouTubePlayerManager

Allows you to embed YouTube videos via Javascript. It can handle several YouTube videos per page.

Each YouTubePlayer object can have 2 hooks you can use.

This first one is `on_state_change` to track / log video events such as 'unstarted', 'ended', 'playing', 'paused', 'buffering', 'cued'.

The second one is `on_progress_change` to track down video progress (in percentage).

## Usage Flash Player

```
var ytp_flashplayer = new YouTubePlayer('ytapiplayer', 'eQtai7HMbuQ');
var ytpm = new YouTubePlayerManager();

ytpm.add(ytp_flashplayer);

ytp_flashplayer.on_state_change = function(state) {
  console.log(state)
}

ytp_flashplayer.on_progress_change = function(perc) {
  console.log(perc)
}

ytp_flashplayer.add_player();
```

## Usage HTML 5

```
var ytp_html5 = new YouTubePlayer('ytapiplayer', 'eQtai7HMbuQ', null, null, true);
var ytpm = new YouTubePlayerManager();

ytpm.add(ytp_html5);

ytp_html5.on_state_change = function(state) {
  console.log(state)
}

ytp_html5.on_progress_change = function(perc) {
  console.log(perc)
}

ytp_html5.add_player();
```

## Dependencies
- swfobject (https://code.google.com/p/swfobject/)

## Info

Proximity BBDO
