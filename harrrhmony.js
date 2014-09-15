var teoria = require('teoria');

function harrrhmony (frequency) {
  var note = teoria.note.fromFrequency(frequency);

  var scale = note.note.scale('mixolydian');

  var harmony = {
    third: scale.get('third'),
    fifth: scale.get('fifth')
  };

  return {
    note: note,
    harmony: harmony
  }
};

module.exports = harrrhmony;