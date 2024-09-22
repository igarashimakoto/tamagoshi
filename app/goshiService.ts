import { useSQLiteContext } from "expo-sqlite";
import {Save} from "@/tipes/tipes";

export function useGoshiDatabase() {

    const database = useSQLiteContext();

    async function createSave({ name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus }: {
        name: string, goshiType: number,
        goshiHealth: number, goshiSleep: number, goshiHappiness: number, goshiStatus: string
    }) {

        console.log( name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus );

        const query = await database.prepareAsync(`INSERT INTO saves (name, goshiType, goshiHealth, goshiSleep, 
                                                   goshiHappiness, goshiStatus) VALUES ($name, $goshiType, $goshiHealth, $goshiSleep, 
                                                   $goshiHappiness, $goshiStatus);`);

        try {

            await query.executeAsync({
                $name: name, $goshiType: goshiType, $goshiHealth: goshiHealth, $goshiSleep: goshiSleep,
                $goshiHappiness: goshiHappiness, $goshiStatus: goshiStatus
            })
        } catch (err) {

            console.log(err);
        } finally {

            await query.finalizeAsync();
        }
    }

    async function getSaves() {

        try {
            const response = await database.getAllAsync(`SELECT * FROM saves;`)
            return response;
        } catch (err) {
            console.log(err)
        }
    }

    async function getSingleSave({ goshiid }: { goshiid: number }): Promise<Save | undefined> {
        const query = `SELECT * FROM saves WHERE id = $id;`;
    
        try {

            const result: Save[] = await database.getAllAsync<Save>(query, { $id: goshiid });
    
            if (result.length > 0) {

                return result[0];
            } else {
                console.log('Save não encontrado.');
                return undefined;
            }
        } catch (err) {
            console.log('Erro ao buscar o save:', err);
            return undefined;
        } 
    }

    async function updateSave({goshiid, health, sleep, happiness, status }: {
    goshiid: number, health: number, sleep: number, happiness: number, status: string}) { 

        console.log("entrou aqui",  goshiid, health, sleep, happiness, status );

        const query = await database.prepareAsync(`UPDATE saves SET goshiHealth=$health, goshiSleep=$sleep, 
            goshiHappiness=$happiness, goshiStatus=$status WHERE id=$goshiid`);

            try {

                await query.executeAsync({$health :health, $sleep: sleep, $happiness: happiness, $status: status, $goshiid: goshiid});

            } catch (err) {
    
                console.log('update deu erro');
                console.log(err);
            } finally {
                
                console.log('update deu certo')
                await query.finalizeAsync();
            }
    }

    async function updateHappiness({goshiid, happiness }: {
        goshiid: number, happiness: number}) { 
    
            console.log("entrou aqui de happiness",  goshiid,happiness );
    
            const query = await database.prepareAsync(`UPDATE saves SET goshiHappiness=$happiness WHERE id=$goshiid`);
    
                try {
    
                    await query.executeAsync({$happiness: happiness, $goshiid: goshiid});
    
                } catch (err) {
        
                    console.log('update deu erro');
                    console.log(err);
                } finally {
                    
                    console.log('update deu certo')
                    await query.finalizeAsync();
                }
        }    

    async function deleteSave({ id }: { id: number }) {

        const query = await database.prepareAsync('DELETE FROM saves WHERE id=?');

        try {

            await query.executeAsync([id]);

        } catch (err) {

            console.log(err);
        } finally {

            await query.finalizeAsync();
        }
    }

    
    async function createSavesExamples() {

        const result: any[] = await database.getAllAsync(`SELECT COUNT(*) as count FROM saves;`);

        if (result.length > 0) {

            const count = result[0].count;

            if (count === 0) {

                await database.execAsync(`INSERT INTO saves (name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus) VALUES 
                    ('Goshi1', 1, 100, 100, 100, 'Alive'),
                    ('Goshi2', 2, 90, 80, 85, 'Sick'),
                    ('Goshi3', 1, 70, 95, 60, 'Dead'),
                    ('Goshi4', 3, 75, 90, 70, 'Alive');
                    `);

                console.log("Registros de teste inseridos.");
            }
        }
    }


return { createSave, getSaves, getSingleSave, createSavesExamples, updateHappiness, updateSave, deleteSave }
}