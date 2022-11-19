import React from 'react';
import { connect } from 'react-redux';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';
import {HeaderComponent} from "./Header";


export const TestimonialComponent = () => (
  <div>
    <ConnectedNav />
    <HeaderComponent/>
      <div className="card border-0 ">
          <div className="row justify-content-center">
              <div className="col-md-10">
                  <div className="card-body border-dark card border-1">
                      <h5 className="card-title">Testimonials:</h5>
                      <hr />
                      <p>
                          I found your program through a PrePT Grind webcast and I am grateful that I did, although I wish I found it sooner.
                          Before coming across PT School Match, I basically did my own version of what your program does, meaning I did all that hard work
                          of looking through all grad programs through PTCAS website when I could have simply came to the same conclusions with your program at a faster rate!
                          <br/>
                          <br/>
                          Overall, this is a great program for Pre PT students to jump start on when looking at schools and not having to self search through PTCAS.
                          <br/>
                          <br/>
                          Thank you for creating this program.
                          <br/>
                          <b>– Morgan P</b>
                          <hr />
                      </p>
                      <p>
                          Honestly it's been amazing!!! I was doing the exact same thing for all of my top schools in an excel spreadsheet,
                          and it took me forever to collect all the info so I am SOOO glad that you have everything listed for all of the schools.
                          <br/>
                          <br/>
                          <b>– Samantha E</b>
                          <hr />
                      </p>
                      <p>
                          I would like to say thank you for creating PT School Match! It has helped me so much with searching for PT schools to apply to without having to google each and individual school.
                          It is super easy to use and I have had no issues whatsoever. Thank you again!
                          <br/>
                          <br/>
                          <b>– Charlene C</b>
                          <hr />
                      </p>
                      <p>
                          I am really enjoying PT School Match and I appreciate how easy it is to access all of the information about PT programs that would have taken me hours to find and record.
                          It is a great tool for those who are looking into starting their journey towards a career in physical therapy.
                          <br/>
                          <br/>
                          <b>– Valerie A</b>
                          <hr />
                      </p>
                      <p>
                          The software has proved extremely  helpful for me as I evaluate programs I will be applying to this cycle.
                          It definitely cuts that time down that I would be spending going through the directory on PTCAS.
                          <br/>
                          <br/>
                          Thanks so much for creating this resource!
                          <br/>
                          <br/>
                          <b>– Ariana M</b>
                          <hr />
                      </p>
                  </div>
              </div>
          </div>
      </div>
  </div>
);
