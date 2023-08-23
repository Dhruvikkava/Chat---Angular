import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MessageServiceService } from 'src/app/services/message-service.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  newMessage?: string;
  messageList:any = [];
  profData:any;
  isShowInput:boolean = false;
  roomId!:string;
  uploadedFile!:File | string;
  roomData:any = [];
  skip:number = 0;
  skipCount:number = 0;
  limit:number = 10;
  oneRoomData:any = [];
  isScrollBottom:boolean = true;
  scrolledDiv:number = 0
  scrollPos!:number;
  isShowLoader:boolean = false;
  isLoading:boolean = true;
  roomName!:string;

  @ViewChild('target') private myScrollContainer!: ElementRef | any;

  constructor(private chatService: MessageServiceService,private elementRef: ElementRef,private renderer: Renderer2) { }

  ngOnInit(): void {
    let prof:any = localStorage.getItem('PROF')
    this.profData = JSON.parse(prof);
    this.connectUser();
    this.getNewMessages();
    this.receiveSocketRoomId();
    this.getAllRoomData();
    this.getOneRoomData();
    this.unreadUserMessage();

  }

  onScroll() {
    const scrollDiv = this.elementRef.nativeElement.querySelector('.insights-results');
    var windowScroll = scrollDiv.scrollTop ;
    this.isScrollBottom = false

    if(this.isBottom(scrollDiv)){
      console.log("first",scrollDiv.scrollHeight)
      this.scrollPos = scrollDiv.scrollTop ? scrollDiv.scrollTop : 0
    }
    if (scrollDiv.scrollTop === 0 && this.oneRoomData.length != 0) {
      if(this.isLoading == false){
        if(this.oneRoomData.length != 0){
          this.loadMoreItems();
        }
      }else{
        this.isShowLoader = true
        setTimeout(() => {
          this.isShowLoader = false
          let pos = scrollDiv.scrollHeight - (this.scrollPos)
          console.log("windowScrollpos",pos)
          console.log("windowScroll",this.scrollPos)
          console.log("scrollHeight",scrollDiv.scrollHeight)

          if(this.oneRoomData.length != 0){
            this.loadMoreItems();
          }
        }, 1500);
      }

    }
    this.scrolledDiv = windowScroll
  }

  isBottom(scrollDiv:any) {
    return scrollDiv.scrollHeight - scrollDiv.scrollTop === scrollDiv.clientHeight;
  }

  async loadMoreItems(){
    this.skip = this.skip == 0 ? 10 : this.skip+ this.limit
    this.skipCount = this.skipCount + 1
    await this.chatService.loadMoreItems({roomId: this.roomId, skip:this.skip, limit: this.limit})
  }

  connectUser(){
    this.chatService.connectUser(this.profData)
  }

  async receiveSocketRoomId(){
    await this.chatService.receiveSocketRoomId().subscribe((res:any) => {
      console.log("createdsocketRoomId", res)
      if(res['createdRoomId']){
        this.roomId = res['createdRoomId']
      }
    })
  }

  async unreadUserMessage(){
    this.chatService.unreadUserMessage().subscribe((res:any) => {
      console.log("unreadUserMessage",res)
      if(this.roomData.length != 0){
        this.roomData.forEach((element:any) => {
          if(element.chatroom.unique_room_id == res.roomId){
            console.log("element",element,element.unreadChatMessages)
            element.unreadChatMessages = element.unreadChatMessages + 1;
          }
        });
      }
    })
  }

  async getOneRoomData(){
    await this.chatService.getOneRoomData().subscribe((res)=> {
      console.log("getOneRoomData", res)
      this.oneRoomData = res
      if(res.length != 0){
        let messageList:any = []
        res.forEach((data:any) => {
          if(data.userId == this.profData._id){
            data['isSendUser'] = true
            console.log("first", data)
            messageList.push(data);
          }else{
            messageList.push(data);
          }
        });
        const combinedArray = messageList.reverse().concat(this.messageList);
        console.log("messageList",combinedArray)
        // if(this.messageList.length == 0){
          this.messageList = combinedArray;
        // }else{

        // }
        if(this.isScrollBottom == true){
          console.log("fft")
          setTimeout(() => {
            this.myScrollContainer.nativeElement.scroll({
              top: this.myScrollContainer.nativeElement.scrollHeight,
              left: 0,
            });
          }, 0);
        }else{
          if(this.skip == 0){
            setTimeout(() => {
              console.log("fft1")
                const scrollDiv = this.elementRef.nativeElement.querySelector('.insights-results');
                scrollDiv.scrollTo(0,scrollDiv.scrollHeight);
            }, 0);
          }else{
            if(res.length != 0){
              if(res.length < this.limit){
                console.log("fft1")
                this.isLoading = false;
                this.isShowLoader = false
              }else{
                console.log("fft2")
                setTimeout(() => {
                  const scrollDiv = this.elementRef.nativeElement.querySelector('.insights-results');
                  if(res.length < this.limit){
                    scrollDiv.scrollTo(0,0);
                  }else{
                    scrollDiv.scrollTo(0,1175);
                  }
                }, 0);
              }
            }
          }
        }
      }
    })
  }

  async getAllRoomData(){
    await this.chatService.getAllRoomData().subscribe((res)=> {
      console.log("getAllRoomData", res)
      this.roomData = res.response;
      this.roomData.forEach((element:any) => {
          element.unreadChatMessages = element.unreadChatMessages ? element.unreadChatMessages : 0;
      });
    })
  }

  async getNewMessages(){
    await this.chatService.getNewMessage().subscribe((data: any) => {
      if(data){
        if(Object.keys(data).length != 0){
          if(data.userId == this.profData._id){
            data['isSendUser'] = true
            console.log("first", data)
            // if(data.message == null){
            //   data.file = 'http://192.168.1.139:3000/uploads/'+data.file
            // }
            this.messageList.push(data);
          }else{
            // if(data.message == null){
            //   data.file = 'http://192.168.1.139:3000/uploads/'+data.file
            // }
            this.messageList.push(data);
          }
          setTimeout(() => {
            // const elementList = this.elementRef.nativeElement.querySelector('.insights-results');
            // // const element = elementList[0] as HTMLElement;
            // elementList.scrollIntoView({ behavior: 'smooth' });

            // this.myScrollContainer.scrollTop = this.myScrollContainer.scrollHeight;

            const scrollContainerElement = this.myScrollContainer.nativeElement;
            this.renderer.setProperty(
              scrollContainerElement,
              'scrollTop',
              scrollContainerElement.scrollHeight
            );
          }, 0);
        }
      }
    })
  }

  sendMessage() {
    console.log("uploadedFile",this.uploadedFile)
    if(this.roomId){
      console.log("first,this.newMessage",this.newMessage)
      let sendObj:any = {
        message: this.newMessage,
        userId: this.profData._id,
        roomId:this.roomId
      }
      if(this.uploadedFile){
        sendObj.file = this.uploadedFile
      }
      this.chatService.sendMessage(sendObj);
      this.newMessage = '';
    }
  }

  createRoom(){
    const roomName = prompt('Enter Room name:')
    if(roomName){
      if(this.messageList.length != 0){
        this.messageList = []
      }
      this.chatService.createRoom({...this.profData, roomName})
    }
  }

  joinRoom(){
    let prepareObj = {
      roomId: this.roomId,
      userId: this.profData._id
    }
    this.chatService.joinRoom(prepareObj);
    this.messageList = []
  }

  joinExistingRoom(roomId:string, roomName: string){
    this.roomName = roomName
    if(this.messageList.length != 0){
      this.messageList = []
    }
    let prepareObj = {
      roomId: roomId,
      userId: this.profData._id
    }
    this.chatService.joinRoom(prepareObj)
  }

  sendMarkReadMsg(roomId:string){
    this.chatService.sendMarkReadMsg({roomId:roomId, userId: this.profData._id})
    this.roomData.forEach((element:any) => {
      if(element.chatroom.unique_room_id == roomId){
        element.unreadChatMessages = 0
      }
    });
  }

  changeFile(event:any){
    let file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e:any) {
    this.uploadedFile = 'data:image/png;base64,' + btoa(e.target.result);
  }
}
