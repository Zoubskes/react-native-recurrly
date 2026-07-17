import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { posthog } from '../../src/config/posthog';

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string}>();

    useEffect(() => {
        posthog.capture('subscription_details_viewed', { subscription_id: id });
    }, [id]);

    return (
        <View>
            <Text>Subscription Details: {id}</Text>
            <Link href="/">Go back</Link>
        </View>
    )
}
export default SubscriptionDetails
