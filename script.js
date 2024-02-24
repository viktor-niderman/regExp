const { createApp } = Vue

createApp({
  methods: {
    setCurrentFlagInfo (str) {
      this.selectedFlagInfo = str
    },
    enableMod (index) {
      this.modes.forEach((v, i) => {
        if (i !== index) {
          this.modes[i].enable = false
        } else {
          this.modes[i].enable = !this.modes[i].enable
        }
      })
    },
  },
  computed: {
    result () {
      this.expression.isCorrect = true
      if (!this.expression.string) return ''

      try {
        let reg = new RegExp(this.expression.string, this.generatedFlags)
        let rez = ''
        if (this.modes[0].enable) {
          rez = this.text.match(reg)
        } else if (this.modes[1].enable) {
          rez = reg.test(this.text)
        } else if (this.modes[2].enable) {
          this.replacedText = this.text.replace(reg, this.replaceInput)
          rez = '⬇'
        }
        return rez === null ? 'null' : rez
      } catch (e) {
        this.expression.isCorrect = false
        return '⛔ Syntax error in RegExp'
      }

    },
    generatedFlags () {
      let str = ''
      this.flags.forEach(flag => {
        if (flag.enable) {str += flag.name}
      })
      return str
    },
  },
  data () {
    return {
      modes: [
        { name: 'match', enable: true },
        { name: 'test', enable: false },
        { name: 'replace', enable: false },
      ],
      flags: [
        {
          name: 'g',
          enable: true,
          info: 'Search finds all matches; without it, only the first match is found',
        },
        { name: 'i', enable: false, info: 'Case-insensitivity' },
        { name: 'm', enable: false, info: 'Multiline mode' },
        {
          name: 's',
          enable: false,
          info: 'Enables "dotall" mode, where the dot . can match a newline character \n',
        },
        { name: 'u', enable: false, info: 'Enables full Unicode support' },
        {
          name: 'y',
          enable: false,
          info: 'Search mode at a specific position in the text',
        },
      ],
      selectedFlagInfo: '',
      expression: {
        string: '',
        isCorrect: true,
      },
      originText: '',
      text: '',
      replacedText: '',
      replaceInput: '',
      needHelp: false,
    }
  },
  mounted () {
    window.onload = () => {
      this.originText = window.text
      this.text = this.originText
    }

    document.addEventListener('mouseup', event => {
      let selection = window.getSelection()
      let ext = selection.extentNode
      let isMainText = false
      for (let i = 0; i < 5; i++) {
        if (ext?.id === 'mainText') {
          isMainText = true
          break
        }
        try {
          ext = ext.parentNode
        } catch (e) {
          break
        }
      }

      if (isMainText) {
        let exactText = selection.toString()
        if (exactText) {
          this.text = exactText
          return
        }
      }

      this.text = this.originText
    })
  },
}).mount('#app')
