var teoria = require('teoria');

function harrrhmony (frequency) {
  var note = teoria.note.fromFrequency(frequency);
  var scale = note.note.scale('mixolydian');

  var harmony = {
    third: teoria.note(scale.get('third').coord),
    fifth: teoria.note(scale.get('fifth').coord)
  };

  return {
    note: note,
    harmony: harmony
  }
};

module.exports = harrrhmony;