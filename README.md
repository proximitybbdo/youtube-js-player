# YouTubePlayer / YouTubePlayerManager

Allows you to embed YouTube videos via Javascript. It can handle several YouTube videos per page.

Each YouTubePlayer object can have 2 hooks you can use.

This first one is `on_state_change` to track / log video events such as 'unstarted', 'ended', 'playing', 'paused', 'buffering', 'cued'.

The second one is `on_progress_change` to track down video progress (in percentage).

## Usage

```
var ytp = new YouTubePlayer('ytapiplayer', 'eQtai7HMbuQ');
var ytpm = new YouTubePlayerManager();

ytpm.add(ytp);

ytp.on_state_change = function(state) {
  console.log(state)
}

ytp.on_progress_change = function(perc) {
  console.log(perc)
}

ytp.add_player();
```

## Info

Proximity BBDO