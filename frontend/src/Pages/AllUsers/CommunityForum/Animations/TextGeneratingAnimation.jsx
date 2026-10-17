import styles from './RewriteAnimation.module.css'
import { useState, useEffect } from 'react';

function TextGeneratingAnimation({ text }) {

    const [animText, setAnimText] = useState(''); // text that animates

    const [animFinished, setAnimFinished] = useState(false); // used to render a normal <p>

    // this works by splitting the text into an array of spans so they have a different animation-delay for gradient generation animation
    const getTextAsSpans = () => {
        return Array.from(text).map((character, index, array) => (
            <span
                key={index}
                style={{
                    animationDelay: `${0.01 * index}s`, // adds 0.01s animation-delay to each span by using the index value
                }}
                onAnimationEnd={index === array.length - 1 ? handleAnimationEnd : undefined} // attach event to the last span
            >
                {character}
            </span>
        ));
    };

    const handleAnimationEnd = () => {
        setAnimFinished(true); // used for replacing spans with a normal <p>
    };

    useEffect(() => {
        setAnimFinished(false);
        setAnimText(getTextAsSpans());
    }, [text]); // start animation whenever text changes

    return (
        <div className={styles.AIText}>
            {animFinished ? (
                <p>{text}</p> // show paragraph paragraph when animFinished is true
            ) : (
                <p className={styles.generatedText}>
                    {animText} {/* render the animated text as spans when animFinished is false */}
                </p>
            )}
        </div>
    )
}

export default TextGeneratingAnimation