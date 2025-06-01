import {Body, Injectable} from '@nestjs/common';
import {TotwReq} from "./ai.controller";

@Injectable()
export class AiService {

async getTeamOfTheWeek(@Body() totwReq: TotwReq) {
    console.log('balanceTeams api service ai')
    const prompt = `
    You are an AI soccer analyst.
    
    Given a list of soccer players with their number of goals and number of wins, select the best ${totwReq.teamSize} players to form a "Team of the Week".
    you must give me exactly ${totwReq.teamSize} players!
    pay attention, the totalGoalsConceded means goalsConceded as a team.
    Rules:
    - Choose exactly ${totwReq.teamSize} players that keeps the rule that you should have 
    strikers and midfielders more then defenders if possible. 
    - Prioritize players based on:
      - Goals scored (for strikers)
      - Wins contributed to (for all)
      - Balance between individual success (goals) and team success (wins)
    - If there is a tie, prefer players with higher wins and after that goalsConceded.
    
    Output format:
    Return a JSON object with two keys:
    1. \`team\`: an array of ${totwReq.teamSize} selected player names(you must choose ${totwReq.teamSize} different players even if some of them has the same statistics), ordered by position
    2. \`explanation\`: an array with ${totwReq.teamSize} different players(you must choose ${totwReq.teamSize} different players even if some of them has the same statistics), each containing:
       - \`player\`: the player's name
       - \`position\`: striker, midfielder, or defender
       - \`goals\`: number of goals
       - \`wins\`: number of wins
       - \`rating\`: a number from 1 to 10 (indicating performance)
       - \`reason\`: a brief, fun, and slightly humorous explanation of why the player was selected. Feel free to add a quirky touch, like "this player is a goal-scoring machine, and they're hotter than a summer afternoon!"
    
    
    Respond only with string that can be directly converted to JSON object.
    
        ${JSON.stringify(totwReq.players)}.`

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gemma2-9b-it',
                    messages: [
                        { role: 'system', content: 'You help to select the team of the week according to the provided statistics.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });

            const data = await response.json();
            // @ts-ignore
            const result = data.choices?.[0]?.message?.content;
            console.log('result', result)
            if(result) {
                const jsonString = result.match(/```json([\s\S]*?)```/)?.[1]?.trim();
                if (!jsonString) {
                    // @ts-ignore
                    return JSON.parse(data.choices?.[0]?.message?.content) || {} ;
                }
                return JSON.parse(jsonString);

            }
            // @ts-ignore
            return JSON.parse(data.choices?.[0]?.message?.content)|| {};
    }
}
