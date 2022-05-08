// класс для создания таймера обратного отсчета
class CountdownTimer {
    constructor(deadline, сhange, сomplete) {
      this.deadline = deadline; //конечная дата
      this.Change = сhange;
      this.Complete = сomplete;
      this.timerId = null; //id таймера
      this.out = {
        days: '', hours: '', minutes: '', seconds: '',
        daysTitle: '', hoursTitle: '', minutesTitle: '', secondsTitle: ''
      };
      this.start();
    }
    //склонение числительных
    static declensionNum(num, words) {
      return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    //метод, который будет запускать таймер
    start() {
      this.calc();
      this.timerId = setInterval(this.calc.bind(this), 1000); //таймер будет работать через каждую секунду
    }
    //вычисляем разницу дат и устанавливаем оставшееся время в качестве содержимого элементов
    calc() {//метод выполняет расчёт оставшегося времени и обновляет содержимое элементов .timer__item на странице
      const interval = this.deadline - new Date(); //расчет оставшегося времени
      //вычисление оставшегося количества дней, часов, минут и секунд
      const days = interval > 0 ? Math.floor(interval / 1000 / 60 / 60 / 24) : 0;
      const hours = interval > 0 ? Math.floor(interval / 1000 / 60 / 60) % 24 : 0;
      const minutes = interval > 0 ? Math.floor(interval / 1000 / 60) % 60 : 0;
      const seconds = interval > 0 ? Math.floor(interval / 1000) % 60 : 0;
      //вывод оставшегося времени на страницу
      this.out.days = days < 10 ? '0' + days : days; //если значение меньше 10, то к нему добавляется символ «0»
      this.out.hours = hours < 10 ? '0' + hours : hours;
      this.out.minutes = minutes < 10 ? '0' + minutes : minutes;
      this.out.seconds = seconds < 10 ? '0' + seconds : seconds;
      this.out.daysTitle = CountdownTimer.declensionNum(days, ['день', 'дня', 'дней']);
      this.out.hoursTitle = CountdownTimer.declensionNum(hours, ['час', 'часа', 'часов']);
      this.out.minutesTitle = CountdownTimer.declensionNum(minutes, ['минута', 'минуты', 'минут']);
      this.out.secondsTitle = CountdownTimer.declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
      this.Change ? this.Change(this.out) : null; //проверка на продолжение работы таймера
      if (interval <= 0) { //таймер закончился
        clearInterval(this.timerId); //останавливаем работу таймера
        this.Complete ? this.Complete() : null; //выводим сообщение о завершении таймера
      }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //получаем элементы, в которые нужно вывести оставшееся кол-во дней, часов, минут и секунд
    const Days = document.querySelector('.timer__days');
    const Hours = document.querySelector('.timer__hours');
    const Minutes = document.querySelector('.timer__minutes');
    const Seconds = document.querySelector('.timer__seconds');

    //установим конечное время (по времени и дате)
    //пример ввода конечной даты 09.05.22 14.00 -> (2022, 05, 9, 14)
    const deadline = (function(y, m, d, h) { return new Date(y, m-1, d, h); })(2022, 05, 10, 18);
    //const deadline1 = new Date(2022,4,9); //без времени, но с месяцем-1 и без «0»

    //осуществляем обратный отсчет, создав новый объект, используя  new CountdownTimer()
    //передаем: конечную дату (deadline)
    //          функцию, которую нужно выполнять каждую секунду
    //          функцию, которую нужно выполнить после завершения таймера
    new CountdownTimer(deadline, (timer) => {
      Days.textContent = timer.days;
      Hours.textContent = timer.hours;
      Minutes.textContent = timer.minutes;
      Seconds.textContent = timer.seconds;
      Days.dataset.title = timer.daysTitle;
      Hours.dataset.title = timer.hoursTitle;
      Minutes.dataset.title = timer.minutesTitle;
      Seconds.dataset.title = timer.secondsTitle;
    }, () => {
      document.querySelector('.timer__result').textContent = 'Время вышло!';
    });
});