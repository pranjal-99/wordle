import React,{useState,useEffect} from 'react'
import wordsFile from './sgb-words.txt'; 

const Wordle = () => {

    const [word, setWord] = useState(localStorage.getItem('word') || 'which');
    const [dataOfWords, setDataOfWords] = useState([]);
    const [coord, setCoord] = useState({r:0,c:0});
    const [left, setLeft] = useState([]);

    const reset = () => {
        setCoord({r:0,c:0});
        for(let i=0;i<26;i++) {
            document.getElementById(String.fromCharCode('a'.charCodeAt(0)+i)).style.background = 'white';
        }
        for(let i=0;i<6;i++) {
            for(let j=0;j<5;j++) {
                document.getElementById(`r${i}c${j}`).style.background = 'white';
                document.getElementById(`r${i}c${j}`).innerHTML = '';
            }
        }
    }

    useEffect(() => {
        let temp = [];
        for(let i=0;i<26;i++) {
            temp.push(String.fromCharCode('a'.charCodeAt(0)+i));
        }
        setLeft(temp);
        fetch(wordsFile)
  .then(response => response.text())
  .then(data => {
  	// Do something with your data
      let dataWords = data.split('\n');
  	setDataOfWords(dataWords);
  });
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', logKey);
        return () => {
            document.removeEventListener('keydown',logKey);
        };
    }, [coord])


    function logKey(e) {
      if(e.key >= "a" && e.key <= "z") {
        if(coord.c<5 && coord.r<6) {
            document.getElementById(`r${coord.r}c${coord.c}`).innerHTML = e.key.toUpperCase();
            setCoord({r:coord.r,c:coord.c+1});
        }
      }

      else if(e.keyCode === 13 && coord.c===5) {
        async function check_if_word_exists(typed) {
            const url = "https://api.wordnik.com/v4/word.json/" + typed + "/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
            const response = await fetch(url,{method:'GET'});
            if(response.status===200) {
                    for(let i=0;i<5;i++) {
                        if (typed[i]===word[i]) document.getElementById(`r${coord.r}c${i}`).style.background = 'green';
                        else if (word.includes(typed[i]))document.getElementById(`r${coord.r}c${i}`).style.background = 'orange';
                        else document.getElementById(`r${coord.r}c${i}`).style.background = '#889cad';
                    }
                    for(let i=0;i<5;i++) {
                        let clr = document.getElementById(typed[i]).style.background;
                        if (typed[i]===word[i]) document.getElementById(typed[i]).style.background = 'green';
                        else if (word.includes(typed[i]) && clr!=='green')document.getElementById(typed[i]).style.background = 'orange';
                        else if (clr!=='green') document.getElementById(typed[i]).style.background = '#889cad';
                    }
                    setCoord({r:coord.r+1,c:0});
                    if(word===typed) {
                        setCoord({r:6,c:0});
                    }
            }
            else {
                for(let i=0;i<5;i++) {
                    document.getElementById(`r${coord.r}c${i}`).style.background = 'red';
                }
                setTimeout(() => {
                    for(let i=0;i<5;i++) {
                        document.getElementById(`r${coord.r}c${i}`).style.background = 'white';
                    }
                }, 500);
            }
        }
        let typed = '';
        for(let i=0;i<5;i++) {
            typed+= document.getElementById(`r${coord.r}c${i}`).innerHTML
        }
        check_if_word_exists(typed.toLowerCase());
      } 

      else if(e.keyCode === 8 && coord.c>0) {
        document.getElementById(`r${coord.r}c${coord.c-1}`).innerHTML = "";
        setCoord({r:coord.r,c:coord.c-1});
      }
    }

  return (
    <>
        <h3 style={{height:'50px',fontSize: 'x-large', fontFamily: 'cursive'}}>Wordle ({dataOfWords.indexOf(word)+1}/{dataOfWords.length})</h3>
        <div style={{display:'flex',height:'502px'}}>
            <div style={{display:'flex',justifyContent:"center",alignItems:'center',width:'50%'}}>
        <div style={{width:"400px",height:'480px'}}>
            {[0,1,2,3,4,5].map((c)=> {
                return <div style={{display:'flex'}}>
                    {[0,1,2,3,4].map((d)=> {
                    return <div id={`r${c}c${d}`} style={{fontSize: 'xx-large',fontWeight: '700',border:'1px solid black',borderRadius:"5px",display:'flex',alignItems:'center',justifyContent:"center",width:"80px",height:'80px'}}></div>
                })}
                </div>
            })}
            </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',justifyContent:"center",alignItems:'center',width:'50%'}}>
                <div style={{display:'flex',flexWrap:'wrap',height:'120px',width:'400px',borderRadius:'5px',border:"1px solid black"}}>
                    {left.map(c=> {
                        return <div id={c} style={{display:'flex',fontWeight:'500',justifyContent:"center",alignItems:'center',width:'40px',height:'40px'}}>{c.toUpperCase()}</div>
                    })}
                </div>
            </div>
        
        </div>
        <div style={{display:'flex',margin: '50px',justifyContent: 'space-evenly'}}>
            <div style={{background:'black',color:'white',width:'80px',height:'30px',borderRadius:'5px',cursor:'pointer'}} onClick={()=> {if(word!==dataOfWords[0]) {setWord(dataOfWords[dataOfWords.indexOf(word)-1]); localStorage.setItem('word',dataOfWords[dataOfWords.indexOf(word)-1]); reset();}}}>Previous</div>
            <div style={{background:'black',color:'white',width:'80px',height:'30px',borderRadius:'5px',cursor:'pointer'}} onClick={()=> {if(word!==dataOfWords[dataOfWords.length-1]){setWord(dataOfWords[dataOfWords.indexOf(word)+1]); localStorage.setItem('word',dataOfWords[dataOfWords.indexOf(word)+1]); reset();}}}>Next</div>
        </div>
    </>
  )
}

export default Wordle;