<template>
	<span class="wordsBox" v-html="comWords"></span>
</template>

<script>
export default {
    name: 'keywords',
    data () {
        return {
        }
    },
    props: ['keywords', 'words', 'styles'],
    computed: {
        comWords () {
            if (!this.words && this.words != 0) {
                return ''
            }
            if (!this.keywords && this.keywords != 0) {
                return this.words
            }
            let str = this.words.toString()
            if (str.indexOf(this.keywords) != -1) {
                return str.replace(this.keywords, `<span style="${this.styles}">${this.keywords}</span>`)
            } else {
                return this.words
            }
        }
    }
}
</script>