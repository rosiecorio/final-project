"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function UserInfoForm({ submitForm }) {
  const [formStep, setFormStep] = useState(0);
  const form = useForm({
    defaultValues: {
      username: "",
      bio: "",
      postcode: "",
      instrument: "",
      years: "",
      level: "",
      availability: "",
      genre: "",
    },
  });

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 phoneBg h-screen w-screen flex justify-center items-center">
      <Card className="w-[80vw] h-[60vh] bg-text-light">
        <CardHeader>
          <CardTitle className="font-lora italic text-[1.5rem] text-semibold text-background-dark">Encore!</CardTitle>
          <CardDescription className="font-inter text-background">Please tell us more.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-10 relative overflow-x-hidden h-auto font-inter text-accent"
            >
              {/* Step 1: Username, Bio, and Postcode */}
              <motion.div
                className={cn("space-y-3 pl-[1rem] pr-[1rem]", {
                  hidden: formStep !== 0,
                })}
                animate={{
                  x: formStep === 0 ? "0%" : "-100%", // Step 1 slides out when formStep changes
                }}
                transition={{
                  ease: "easeInOut",
                }}
              >
                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username..." {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your bio..." {...field} />
                      </FormControl>
                      <FormDescription>This is your profile bio.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Postcode */}
                <FormField
                  control={form.control}
                  name="post_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your postcode..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Step 2: Instrument, Years, and Level */}
              <motion.div
                className={cn("space-y-3 relative -top-5 left-0 right-0 pl-[0.5rem] pr-[0.5rem] h-auto ", {
                  hidden: formStep !== 1,
                })}
                animate={{
                  x: formStep === 1 ? "0%" : "100%", // Step 2 slides in from the right when formStep is 1
                }}
                transition={{
                  ease: "easeInOut",
                }}
              >
                {/* Instrument */}
                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruments</FormLabel>
                      <FormControl>
                        <Input placeholder="Tell us what instruments you play" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Years Playing */}
                <FormField
                  control={form.control}
                  name="years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years</FormLabel>
                      <FormControl>
                        <Input placeholder="The years you spent playing..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your music level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Beginner", "Novice", "Intermediate", "Advanced", "Professional", "Expert", "Grand Master"].map(
                            (level) => (
                              <SelectItem value={level} key={level}>
                                {level}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Step 3: Gig Ready, Availability, and Genre */}
              <motion.div
                className={cn("space-y-3 relative -top-5 left-0 right-0 pl-[0.5rem] pr-[0.5rem] h-auto", {
                  hidden: formStep !== 2,
                })}
                animate={{
                  x: formStep === 2 ? "0%" : "100%", // Step 3 slides in from the right when formStep is 2
                }}
                transition={{
                  ease: "easeInOut",
                }}
              >
                {/* Gig Ready */}
                <FormField
                  control={form.control}
                  name="gig_ready"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gig ready</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Are you gig ready?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Yes", "No"].map((gig_ready) => (
                            <SelectItem value={gig_ready} key={gig_ready}>
                              {gig_ready}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Availability */}
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Yes", "No"].map((availability) => (
                            <SelectItem value={availability} key={availability}>
                              {availability}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Genre */}
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Rock",
                            "Metal",
                            "Jazz",
                            "Classical",
                            "Pop",
                            "Hip Hop",
                            "Electronic",
                            "Country",
                            "Blues",
                            "Folk",
                            "R&B",
                            "Ska",
                            "Eclectic",
                          ].map((genre) => (
                            <SelectItem value={genre} key={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <div className="relative flex justify-between text-background">
                <Button
                  type="button"
                  variant={"ghost"}
                  className={cn({
                    hidden: formStep === 2,
                  })}
                  onClick={() => {
                    setFormStep((prevStep) => prevStep + 1); // Increment the step to go to the next one
                  }}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="relative flex justify-between bottom-[2rem]">
                <Button
                  type="submit"
                  className={cn("bg-background-dark text-text-sand",{
                    hidden: formStep === 0 || formStep === 1,
                  })}
                  onClick={() => {
                    form.trigger(["instrument", "years", "level", "gig_ready", "availability", "genre"]);
                  }}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant={"ghost"}
                  className={cn({
                    hidden: formStep === 0 || formStep === 1,
                  })}
                  onClick={() => {
                    setFormStep(0);
                  }}
                >
                  Go Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}