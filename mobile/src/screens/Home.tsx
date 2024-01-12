import { useState, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSumaryDatesSizes = 18 * 5;
const amountofDaysToFill = minimumSumaryDatesSizes - datesFromYearStart.length;
export function Home() {
    const [loading, setLoading] = useState(true);
    const [sumary, setSumary] = useState(null);

    const { navigate } = useNavigation();

    async function fetchDate() {
        try {
            setLoading(true);
            const response = await api.get('/sumary');
            setSumary(response.data);
        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar os hábitos.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDate();
    }, []);

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekdays.map((weekDay, i) => (
                        <Text
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>

                    ))
                }
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => (
                            <HabitDay
                                key={date.toISOString()}
                                onPress={() => navigate('habit', { date: date.toISOString() })}
                            />
                        ))
                    }

                    {
                        amountofDaysToFill > 0 && Array
                            .from({ length: amountofDaysToFill })
                            .map((_, index) => (
                                <View
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                />
                            ))
                    }
                </View>
            </ScrollView>
        </View>
    )
}