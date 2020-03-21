var app = new Vue({
    el:'#app',
    data:{
        task: "任务",
        time_minute: 0,
        time_second:3,
        on_task:false,
        notification:"点按以开始",
        completed:0,
        lock:true,
        stat:"init",
        display_task:false
    },
    methods:{
        nextTask:function(){
            if(this.stat=="init"){
                this.on_task=true
                this.lock=false
                this.stat="normal"
                this.display_task=true
            } else if(this.stat=="normal"){
                // Pause and ask
                // this.lock=true
                var orig_if_display=this.display_task
                var orig_notification=this.notification
                this.stat="ask"
                this.notification="再次点按以确认进入下一个任务"
                this.display_task=false
                var f = (orig_if_display) => {
                    return ()=>{
                        if(this.stat=="ask"){
                            this.display_task=orig_if_display
                            this.stat="normal"
                            this.notification=orig_notification
                        }
                    }
                }
                setTimeout(f(orig_if_display, orig_notification), 3000);
            } else if(this.stat=="ask") {
                this.completeTask()
                this.stat="normal"
            }

        },
        completeTask:function(){
            this.stat="normal"
            if(this.on_task){
                this.completed = this.completed + 1
                if(this.completed%4==0){
                    this.notification="长时间休息"
                    this.time_minute=20
                    this.time_second=0
                    this.on_task=false
                    this.display_task=false
                    this.lock=false
                    
                } else {
                    this.notification="短时间休息"
                    this.time_minute=5
                    this.time_second=0
                    this.on_task=false
                    this.lock=false
                    this.display_task=false
                }
            } else {
                this.on_task=true
                this.display_task=true
                this.lock=false
                this.time_minute=25
                this.time_second=0
            }

        }
    }
})

setInterval(()=>{
    if(!app.lock){
        if(app.time_second>0){
            app.time_second=app.time_second-1
        } else if(app.time_second==0 && app.time_minute>0){
            app.time_second=59
            app.time_minute=app.time_minute-1
        } else {
            app.completeTask()
        }
    }


},1000)