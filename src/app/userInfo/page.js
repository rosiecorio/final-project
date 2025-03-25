'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

import { motion } from "framer-motion"
export default function Page() {
     const [formStep, setFormStep] = React.useState(0)
     const form = useForm({
        defaultValues: {
                username: '',
                bio: '',
                postcode: '',
                instrument: '',
                years: '',
                level: '',
                availability: '',
                genre: '',
        }
     })
     const onSubmit = (data) => {
        console.log(data)
     }
        return (
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                       <Card className="w-[500px]">
                        <CardHeader>
                                <CardTitle>Encore!</CardTitle>
                                <CardDescription>Please tell us more.</CardDescription>
                        </CardHeader>
                        <CardContent>
                                <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-3 relative overflow-x-hidden ">
                                                <motion.div className={cn("space-y-3", {
                                                        //  hidden:formStep ==1
                                                })}
                                                animate={{
                                                        translateX: `-${formStep * 100}%`,
                                                }}
                                                transition={{
                                                        ease: 'easeInOut',
                                                }}>
                                                         {/* username */}
                                                <FormField control={form.control}
                                                name="username"
                                                render={({field}) => (
                                                        <FormItem>
                                                                <FormLabel>Username</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="Enter your username..."{...field} />
                                                                </FormControl>
                                                                <FormDescription>
                                                                        This is your public display name.
                                                                </FormDescription>
                                                                <FormMessage />
                                                        </FormItem>
                                                )} />
                                                {/* bio */}
                                                <FormField control={form.control} name="bio"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Bio</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="Enter your bio..." {...field} />
                                                                </FormControl>
                                                                <FormDescription>
                                                                        This is your profile bio.
                                                                </FormDescription>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                {/* postcode */}
                                                    <FormField control={form.control} name="postcode"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Location</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="Enter your postcode..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                </motion.div>
                                               <motion.div className={cn("space-y-3 absolute top-0 left-0 right-0", {
                                                //hidden:formStep ==0
                                               })}
                                               animate={{
                                                translateX: `${100 - formStep * 100}%`,
                                               }}
                                                style={{
                                                translateX: `${100 - formStep * 100}%`,
                                               }}
                                               transition={{
                                                ease:"easeInOut",
                                               }}>
                                                {/* instrument */}
                                                    <FormField control={form.control} name="instrument"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Instruments</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="Tell us what instruments you play" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                {/* years playing dropdown?*/}
                                                    <FormField control={form.control} name="years"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Years</FormLabel>
                                                                <FormControl>
                                                                        <Input placeholder="The years you speant playing..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                {/* level dropdown?*/}
                                                    <FormField control={form.control} name="level"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Level</FormLabel>
                                                                <Select 
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                                        <FormControl>
                                                                                <SelectTrigger>
                                                                                        <SelectValue placeholder="Select your music level" />
                                                                                </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                                {['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Professional', 'Expert', 'Grand Master'].map((level) => {
                                                                                        return (
                                                                                                <SelectItem value={level} key={level}>
                                                                                                        {level}
                                                                                                </SelectItem>
                                                                                        )
                                                                                })}
                                                                        </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                {/* availabilty bool dropdown*/}
                                                    <FormField control={form.control} name="availability"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Availability</FormLabel>
                                                                <Select 
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                                        <FormControl>
                                                                                <SelectTrigger>
                                                                                        <SelectValue placeholder="Select your availability" />
                                                                                </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                                {['Yes', 'No', 'Not Sure 🤔'].map((availability) => {
                                                                                        return (
                                                                                                <SelectItem value={availability} key={availability}>
                                                                                                        {availability}
                                                                                                </SelectItem>
                                                                                        )
                                                                                })}
                                                                        </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                                {/* genre dropdown*/}
                                                    <FormField control={form.control} name="genre"
                                                render={({field}) =>(
                                                        <FormItem>
                                                                <FormLabel>Genre</FormLabel>
                                                                <Select 
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                                        <FormControl>
                                                                                <SelectTrigger>
                                                                                        <SelectValue placeholder="Select your music genre" />
                                                                                </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                                {['Rock', 'Metal', 'Jazz', 'Classical', 'Pop', 'Hip Hop', 'Electronic', 'Country', 'Blues', 'Folk', 'R&B', 'Ska', 'Eclectic', ].map((genre) => {
                                                                                        return (
                                                                                                <SelectItem value={genre} key={genre}>
                                                                                                        {genre}
                                                                                                </SelectItem>
                                                                                        )
                                                                                })}
                                                                        </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                        </FormItem>
                                                )}/>
                                               </motion.div>
                                                <div className="flex gap-2">
                                                        <Button type="submit" className={cn({hidden: formStep == 0,})}>
                                                                Submit
                                                        </Button>
                                                        <Button type="Button" variant={"ghost"} className={cn({ hidden: formStep == 1})}
                                                        onClick={() => {
                                                                form.trigger(['username', 'bio', 'postcode', 'instrument', 'years', 'level', 'availability', 'genre'])
                                                                const formState = form.getValues()
                                                                const invalidFields = Object.keys(formState).filter((key) => !formState[key])
                                                                if (invalidFields.length > 0) return
                                                                setFormStep(1)
                                                        }}>
                                                                Next Step 
                                                                <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                        <Button 
                                                        type="button" 
                                                        variant={"ghost"} 
                                                        onClick={() => setFormStep(0)}
                                                        className={cn({ hidden: formStep == 0})}
                                                        >
                                                                Go Back
                                                        </Button>
                                                </div>
                                        </form>
                                </Form>
                        </CardContent>
                        </Card> 
                </div>
        )
}