import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  socket:any = io('http://localhost:4000');

  public sendMessage(message:any) {
    this.socket.emit('message', message);
  }

  public connectUser(message:any) {
    this.socket.emit('connectUser', message);
  }

  public getNewMessage = () => {
    // this.socket.on('message', (message:any) =>{
    //   this.message$.next(message);
    // });

    // return this.message$.asObservable();
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  };

  public receiveSocketRoomId = () => {
    return new Observable<any>(observer => {
      this.socket.on('created_room_id', (data: any) => {
        observer.next(data);
      });
    });
  };

  unreadUserMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('unreadUserMessage', (data: any) => {
        observer.next(data);
      });
    });
  }

  getAllRoomData(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('get_all_room_data', (data: any) => {
        observer.next(data);
      });
    });
  }

  getOneRoomData(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('oneRoomData', (data: any) =>{
        observer.next(data);
      });
    });
  }

  public createRoom = (userData:any) => {
    this.socket.emit('createRoom', userData);
  };

  public loadMoreItems = (userData:any) => {
    this.socket.emit('loadMoreItems', userData);
  };

  public joinRoom = (roomData:any) => {
    this.socket.emit('joinRoom', roomData);
  };

  public sendMarkReadMsg = (roomData:any) => {
    this.socket.emit('sendMarkReadMessage', roomData);
  };

  public getRoomData:any = () => {
    this.socket.fromEvent('getRoomData').pipe(map(data => data));
  };
}
