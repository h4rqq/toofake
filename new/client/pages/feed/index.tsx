
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Instant from '@/components/instant/instant';
import Instance from '@/models/instance';
import { useState } from 'react';

import s from './feed.module.scss';

export default function Feed() {

    let [instances, setInstances] = useState<{ [key: string]: Instance }>({})

    useEffect(() => {
        let token = localStorage.getItem("token");
        let body = JSON.stringify({ "token": token });

        let options = {
            url: "/api/feed",
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: body,
        }
        

        axios.request(options).then(
            async (response) => {
                
                console.log(response.data);
                let newinstances: { [key: string]: Instance } = {};

                async function createInstance(data: any) {
                    let id = data.id;
                    let newinstance = await Instance.create(data);
                    newinstances[id] = newinstance;
                    return newinstance;
                }

                for (let i = 0; i < response.data.length; i++) {
                    await createInstance(response.data[i]);
                }
                console.log("newinstances");
                console.log(newinstances);
                setInstances(newinstances);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )

    }, [])

    return (
        <div className={s.feed}>
            {
                Object.keys(instances).map((key) => {
                    return (
                        <Instant key={key} instance={instances[key]} />
                    )
                })
            }
        </div>
    )
}