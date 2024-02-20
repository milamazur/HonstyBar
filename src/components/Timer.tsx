import {  createContext, ReactNode } from "react"
import { useNavigate } from "react-router-dom";
import { useTimer } from "use-timer";

const Context = createContext({
    startTimer: () => { },
    stopTimer: () => { },
    pauseTimer: () => { },
    resetTimer: () => { }
});
const Provider = Context.Provider;
const Consumer = Context.Consumer;

function Timer({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const { time, start, pause, reset } = useTimer({
        endTime: 60,
        onTimeOver: () => {
            navigate('/')
        },
        autostart: true
    });

    return (
        <Provider value={
            {
                startTimer: start,
                stopTimer: stop,
                pauseTimer: pause,
                resetTimer: reset
            }

        }>
            {children}
        </Provider>
    )
}
export { Timer, Context }
export default Consumer;

