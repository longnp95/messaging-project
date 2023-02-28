

const availableReaction = ['👍','👏','👎','❤️','💔','😀','😁','🤣','😘','😝','🤤','😮','😡','😤','😴','🤮']

const reactions = availableReaction.map((el)=>{
  return {
    emoji: el
  }
})

module.exports = reactions;