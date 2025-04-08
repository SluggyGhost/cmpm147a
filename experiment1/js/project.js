// project.js - integrate the working generator from Glitch.com
// Author: Joshua Acosta
// Date: 4/7/2025

function main() {
  const fillers = {
      weather:["clear", "overcast", "cloudy", "rainy", "stormy", "windy", "snowy"],
      season:["winter", "spring", "summer", "fall"],
      timeOfDay:["morning", "afternoon", "evening", "night"],
      activity:["nearly empty, with only yourself and the employees", "not that busy, with only a few customers", "fairly busy, with only a couple empty tables","bustling with a large crowd", "packed to capacity"],
      opens:["suddenly slams open", "slowly creaks open", "swings lazily open", "opens", "bursts open", "opens and then quickly shuts", "quietly opens"],
      reacts:["ignores the sound, as if this is a regular occurence", "looks on curiously", "looks over in alarm", "looks somewhat disgusted", "glances over, then goes back to their business", "doesn't seem to notice", "looks over and cheers loudly", "becomes silent", "refuses to look", "keeps stealing nervous glances"],
      person:["person", "woman", "man", "beastman", "lizardman", "human", "dwarf", "elf", "gnome", "cyborg", "warforged", "tiefling", "plasmoid", "pile of rocks in the shape of a man", "body of water in the shape of a woman", "goblin", "hobgoblin", "bugbear", "zombie"],
      mark:["an eyepatch", "strange tattoos on their arm", "pale skin", "sharp teeth set in a grin", "white hair", "blonde hair", "black hair", "a glass eye", "golden eyes", "green eyes", "a reptilian tail", "a powerful build", "a slender figure", "a frail figure", "a bald head", "apparent varicose veins", "an extra set of arms", "an extra pair of legs"],
      accessory:["a cowboy hat", "a silver badge", "a midnight black cloak", "a snake like a feather boa", "blue overalls", "a red jacket", "a fancy evening outfit", "a blue cape", "a huge sword on their back", "fake animal ears", "a gold earring", "a single iron gauntlet", "large yellow gloves", "bulky goggles", "tattered clothes", "a white labcoat", "a white kimono", "plants grown in an approximation of a dress"],
      action:["sigh", "groan", "chuckle", "light a cig, taking a deep draw,", "roll their shoulders", "shake out their limbs", "adjust their boots", "adjust their belt", "brush dust off their shoulders", "take off their gloves"],
      move:["saunter over", "march", "walk", "jog", "amble up", "stalk", "creep", "move", "crawl", "drag themselves up", "stumble drunkenly"],
      phrase:["We need more men.", "Your rent is due. Pay up.", "I need a freaking drink.", "Do you have any grapes?", "What year is it?", "What city is this?", "Hi. I'm robbing this place.", "Do you know anyone who buys gold teeth?", "What's on the menu?", "DO. YOU. SPEAK. ENGLISH?", "Are there any dragons around here?", "Are there any rich guys around here?", "I'm looking for some people for a job. Any recommendations?", "I'd like to buy this bar.", "Ok, I'm NEVER doing that again."]
    };
    
  const template = `It's a $weather $season $timeOfDay. The tavern is $activity.
  
  The door $opens. The crowd $reacts.
  
  A $person with $mark, wearing $accessory enters.
  
  They $action and then $move to the counter, saying "$phrase"
  
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    box.innerText = story;
  }
  
  /* global clicker */
  clicker.onclick = generate;
  
  generate();
}

main();
