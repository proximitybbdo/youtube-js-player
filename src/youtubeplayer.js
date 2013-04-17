(function() {

  YouTubePlayerManager = (function() {

    YouTubePlayerManager.prototype.players = [];
    YouTubePlayerManager.prototype.players_ready = [];

    function YouTubePlayerManager() {
      var ref = this;

      window.onYouTubePlayerReady = function(player_id) {
        ref.on_youtube_ready(player_id);
      }

      window.onYouTubeIframeAPIReady = function (e) {
        ref.on_youtube_ready('');
      }
    }

    YouTubePlayerManager.prototype.on_youtube_ready = function(player_id) {
      var player, _i, _len;

      for (_i = 0, _len = this.players.length; _i < _len; _i++) {
        player = this.players[_i];

        if(!this.player_ready(player)) {
          if(!player.html5) {
            player.player_ready(player_id);
          } else {
            player.html5_api_player_ready();
          }

          this.players_ready.push(player);
        }
      }
    }

    YouTubePlayerManager.prototype.player_ready = function(player) {
      var i = this.players_ready.length;

      while (i--) {
        if (this.players_ready[i] === player) {
          return true;
        }
      }

      return false;
    }

    YouTubePlayerManager.prototype.add = function(player) {
      this.players.push(player);
    }

    return YouTubePlayerManager;

  })();

}).call(this);

(function() {

  YouTubePlayer = (function() {

    // Static
    YouTubePlayer.UNSTARTED = 'unstarted';
    YouTubePlayer.ENDED = 'ended';
    YouTubePlayer.PLAYING = 'playing';
    YouTubePlayer.PAUSED = 'paused';
    YouTubePlayer.BUFFERING = 'buffering';
    YouTubePlayer.CUED = 'cued';

    //
    YouTubePlayer.prototype.ytplayer = null;
    YouTubePlayer.prototype.ytinterval = null;
    YouTubePlayer.prototype.progress = -1;

    // Internally set
    YouTubePlayer.prototype.embed_id = '';
    YouTubePlayer.prototype.player_id = '';

    // Via constructor
    YouTubePlayer.prototype.div_id = '';
    YouTubePlayer.prototype.video_id = '';

    // Optional via constructor
    YouTubePlayer.prototype.video_width = "425";
    YouTubePlayer.prototype.video_height = "356";
    YouTubePlayer.prototype.html5 = false;

    function YouTubePlayer(div_id, video_id, video_width, video_height, html5) {
      if(video_width == null) {
        video_width = 425;
      }

      if(video_height == null) {
        video_height = 356;
      }

      if(html5 == null) {
        html5 = false;
      }

      if(div_id == null || video_id == null) {
        throw 'YouTubePlayer :: Embed id, player id and video id must be given.';
      }

      this.video_id = video_id;
      this.div_id = div_id;
      this.video_width = video_width;
      this.video_height = video_height;
      this.html5 = html5;

      var rand = parseInt(Math.random() * 999999);

      this.embed_id = 'yt_embed_' + rand;
      this.player_id = 'yt_player_' + rand;
      this.state_change_fuction = 'yt_function_' + rand;
    }

    YouTubePlayer.prototype.on_state_change = function(action) {};
    YouTubePlayer.prototype.on_progress_change = function(progress) {};

    YouTubePlayer.prototype.player_ready = function(player_id) {
      if(this.player_id === player_id && this.ytplayer === null) {
        this.ytplayer = document.getElementById(this.embed_id);
        this.ytplayer.addEventListener("onStateChange", this.state_change_fuction);

        var ref = this;

        window[this.state_change_fuction] = function(state_code) {
          ref.player_state_changed(state_code);
        }
      }
    }

    YouTubePlayer.prototype.add_player = function() {
      if(!this.html5) {
        this.add_flash_player();
      } else {
        this.html5_add_player();
      }
    }

    YouTubePlayer.prototype.add_flash_player = function() {
      var video_url = "http://www.youtube.com/v/" + this.video_id + "?enablejsapi=1&playerapiid=" + this.player_id + "&version=3";
      var options = { allowScriptAccess: "always", allowFullScreen: 'true' };
      var attr = { id: this.embed_id, name: this.embed_id };

      swfobject.embedSWF(video_url, this.div_id, this.video_width, this.video_height, "8", null, null, options, attr);
    }

    YouTubePlayer.prototype.html5_add_player = function() {
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    YouTubePlayer.prototype.html5_player_ready = function(e) { }

    YouTubePlayer.prototype.html5_api_player_ready = function() {
      var ref = this;

      this.ytplayer = new YT.Player(this.div_id, {
        height: this.video_height,
        width: this.video_width,
        videoId: this.video_id,
        events: {
          'onReady': function(e) {
            ref.html5_player_ready(e);
          },
          'onStateChange': function(e) {
            ref.player_state_changed(e.data);
          }
        }
      });
    }

    YouTubePlayer.prototype.interval_player_start = function() {
      var ref = this;

      this.interval_player_stop();

      this.ytinterval = setInterval(function() {
        ref.update_player_info();
      }, 600);
    }

    YouTubePlayer.prototype.interval_player_stop = function() {
      clearInterval(this.ytinterval);
    }

    YouTubePlayer.prototype.player_state_changed = function(new_state) {
      var action = this.get_state(new_state);

      this.on_state_change(action);

      switch(action) {
        case YouTubePlayer.PAUSED:
          return this.interval_player_stop();
        case YouTubePlayer.PLAYING:
          return this.interval_player_start();
      }
    }

    YouTubePlayer.prototype.get_state = function(state_code) {
      switch(state_code) {
        case -1:
          return YouTubePlayer.UNSTARTED;
        case 0:
          return YouTubePlayer.ENDED;
        case 1:
          return YouTubePlayer.PLAYING;
        case 2:
          return YouTubePlayer.PAUSED;
        case 3:
          return YouTubePlayer.BUFFERING;
        case 4:
          return YouTubePlayer.CUED;
      }

      return '';
    }

    YouTubePlayer.prototype.update_player_info = function() {
      this.progress = this.ytplayer.getCurrentTime() / this.ytplayer.getDuration();

      this.on_progress_change(this.progress);
    }

    return YouTubePlayer;

  })();

}).call(this);
