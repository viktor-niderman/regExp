const { createApp } = Vue

        createApp({
            methods: {
                setCurrentFlagInfo(str) {
                    this.selectedFlagInfo = str;
                },
                enableMod(index) {
                    this.modes.forEach((v, i) => {
                        if (i !== index) {
                            this.modes[i].enable = false;
                        } else {
                            this.modes[i].enable = !this.modes[i].enable;
                        }
                    })
                }
            },
            computed: {
                result() {
                    this.expression.isCorrect = true;
                    try {
                        let reg = new RegExp(this.expression.string, this.generatedFlags);
                        let rez = '';
                        if (this.modes[0].enable) {
                            rez = this.text.match(reg);
                        } else if (this.modes[1].enable) {
                            rez = reg.test(this.text);
                        } else if (this.modes[2].enable) {
                            this.replacedText = this.text.replace(reg, this.replaceInput);
                            rez = "⬇";
                        }
                        return this.expression.string 
                            ? rez
                            : '⌛';
                    } catch (e) {
                        this.expression.isCorrect = false;
                        return '⛔';
                    }
                    
                },
                generatedFlags() {
                    let str = '';
                    this.flags.forEach(flag => {
                        if (flag.enable) {str += flag.name}
                    })
                    return str;
                },
            },
            data() {
                return {
                    modes: [
                        {name: 'match', enable: true},
                        {name: 'test', enable: false},
                        {name: 'replace', enable: false},
                    ],
                    flags: [
                        {name: 'g', enable: true, info: 'Поиск ищет все совпадения, без него – только первое'},
                        {name: 'i', enable: false, info: 'Поиск не зависит от регистра'},
                        {name: 'm', enable: false, info: 'Многострочный режим'},
                        {name: 's', enable: false, info: 'Включает режим «dotall», при котором точка . может соответствовать символу перевода строки \\n'},
                        {name: 'u', enable: false, info: 'Включает полную поддержку Юникода'},
                        {name: 'y', enable: false, info: 'Режим поиска на конкретной позиции в тексте'},
                    ],
                    selectedFlagInfo: '',
                    expression: {
                        string: '',
                        isCorrect: true,
                    },
                    text: '',
                    replacedText: '',
                    replaceInput: '',
                }
            },
            mounted() {
                window.onload = () => {
                    this.text = window.text;
                }
            },
        }).mount('#app')