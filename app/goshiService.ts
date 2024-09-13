import { useSQLiteContext } from "expo-sqlite";

export function useGoshiDatabase() {

    const database = useSQLiteContext();

    async function createSave({ name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus }: {
        name: string, goshiType: number,
        goshiHealth: number, goshiSleep: number, goshiHappiness: number, goshiStatus: string
    }) {

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




return { createSave, getSaves, createSavesExamples }
}