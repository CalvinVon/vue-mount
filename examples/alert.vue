<template>
    <div class="alert">
        {{ _uid }}
        <div class="alert-main"
             v-for="item in notices"
             :key="item.name">
            <div class="alert-content">{{ item.content }}</div>
        </div>
    </div>
</template>

<script>
let seed = 0;

function getUuid() {
    return "alert_" + seed++;
}

export default {
    name: "alert",
    props: ['testProps'],
    data() {
        return {
            target: null,
            uid: this._uid,
            notices: [
                {
                    content: "Alert-Alert-Alert-Alert",
                    duration: 10
                }
            ],
        };
    },
    watch: {
        testProps(newValue) {
            console.log(newValue);
        },
        uid(newValue) {
            console.log(newValue)
        }
    },
    created() {
        this.$on("event", e => console.log("on event, ", e));
        console.log("created");
    },
    mounted() {
        console.log("mounted");
    },
    beforeDestroy() {
        console.log("beforeDestroy");
    },
    methods: {
        add(notice) {
            const name = getUuid();

            let _notice = Object.assign(
                {
                    name: name
                },
                notice
            );

            this.notices.push(_notice);

            // 定时移除，单位：秒
            const duration = notice.duration;
            setTimeout(() => {
                this.remove(name);
            }, duration * 1000);
        },
        remove(name) {
            const notices = this.notices;

            for (let i = 0; i < notices.length; i++) {
                if (notices[i].name === name) {
                    this.notices.splice(i, 1);
                    this.$emit('remove');
                    this.$emit('remove');
                    this.$emit('remove-with-event', i, this.notices);
                    break;
                }
            }
        }
    }
};
</script>

<style>
.alert {
    width: 100%;
    text-align: center;
    pointer-events: none;
}
.alert-content {
    display: inline-block;
    padding: 8px 16px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
}
</style>