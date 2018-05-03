(function() {
    'use strict';
  
    /**
     * @fileoverview Handles the rotation of the homepage header words.
     */
  
    /**
     * CSS selectors/classes map.
     */
    var CLASSES = {
      ACTIVE: 'is-active',
      ENTERING: 'is-entering',
      EXITING: 'is-exiting',
      IS_READY: 'is-ready',
      ROTATOR: 'dac-word-rotator'
    };
  
    /**
     * This class handles the rotation and transitions of a list of words for the
     * header section of the DAC homepage.
     * @param {Element} el The word rotator container element.
     * @constructor
     */
    var DacWordRotator = function(el) {
      /**
       * The word rotator container element.
       * @private {Element}
       */
      this.el_ = el;
  
      /**
       * The list of words to rotate through.
       * @private {Array}
       */
      this.words_ = this.buildWords_();
  
      /**
       * The current selected word.
       * @private {number}
       */
      this.currentIndex_ = 0;
  
      /**
       * The interval between each rotation (in milliseconds).
       * @private {number}
       */
      this.interval_ = 2500;
  
      /**
       * The transition duration (in milliseconds). This should match the
       * transition duration defined in CSS.
       * @private {number}
       */
      this.duration_ = 400;
  
      /**
       * The timeout used to schedule the next word rotation.
       * @private {null|Object}
       */
      this.timeout_ = null;
  
      /*
       * Schedules first word for rotation.
       */
      this.scheduleWord_();
  
      /*
       * Adds `has-loaded` class on document's body to change visibility of
       * elements.
       */
      document.body.classList.add(CLASSES.IS_READY);
  
      /*
       * Allow users to pause animation via click.
       */
      this.el_.addEventListener('click', this.toggleAnimation_.bind(this));
    };
  
    /**
     * Toggles the animation on/off when a user clicks on the rotating word. Used
     * for accessibility purposes.
     * @param {Object} e The event object.
     */
    DacWordRotator.prototype.toggleAnimation_ = function(e) {
      e.preventDefault();
  
      if (this.timeout_) {
        window.clearTimeout(this.timeout_);
        this.timeout_ = null;
      } else {
        this.scheduleWord_();
      }
    };
  
    /**
     * Shuffles an array.
     * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     * @param {Array} array The array to be shuffled.
     * @return {Array} The shuffled array.
     */
    DacWordRotator.prototype.shuffleArray_ = function(array) {
      var counter = array.length;
  
      while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
  
        counter -= 1;
  
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
  
      return array;
    };
  
    /**
     * Retrieves a set of supported words from the `data-words` attribute and
     * randomizes them.
     * @return {Array} The list of randomized words.
     * @private
     */
    DacWordRotator.prototype.buildWords_ = function() {
      var words = this.el_.dataset.words;
  
      if (!words) {
        return [];
      }
  
      words = words.split(',');
  
      // Randomize all words except the first element.
      return [words[0]].concat(this.shuffleArray_(words.slice(1)));
    };
  
    /**
     * Rotate word to the next item in the word list. Handles element transition
     * and visibility scheduling. Schedules next word once completed.
     * @private
     */
    DacWordRotator.prototype.rotateWord_ = function() {
      var nextIndex = this.currentIndex_ + 1;
  
      if (nextIndex === this.words_.length) {
        nextIndex = 0;
      }
  
      var nextWord = this.words_[nextIndex];
      var previousWordEl = this.el_.querySelector('span');
      var nextWordEl = document.createElement('span');
  
      nextWordEl.textContent = nextWord;
      nextWordEl.classList.add(CLASSES.ENTERING);
  
      this.el_.appendChild(nextWordEl);
  
      // Ensure class is applied _after_ element has been added to the DOM.
      nextWordEl.getBoundingClientRect();
      nextWordEl.classList.add(CLASSES.ACTIVE);
  
      previousWordEl.classList.add(CLASSES.EXITING);
      window.setTimeout(function() {
        previousWordEl.parentNode.removeChild(previousWordEl);
      }, this.duration_);
  
      this.currentIndex_ = nextIndex;
      this.scheduleWord_();
    };
  
    /**
     * Schedules a transition in the future. Caches the timeout to allow for
     * animation pausing.
     * @private
     */
    DacWordRotator.prototype.scheduleWord_ = function() {
      this.timeout_ = window.setTimeout(this.rotateWord_.bind(this), this.interval_);
    };
  
    /**
     * Creates a DacWordRotator controller for an element with the
     * `.dac-word-rotator` class.
     */
    DacWordRotator.initialize = function() {
      var el = document.querySelector('.' + CLASSES.ROTATOR);
  
      new DacWordRotator(el);
    };
  
    /*
     * Initializes on frame load.
     */
    window.addEventListener('load', DacWordRotator.initialize);
  })();
  