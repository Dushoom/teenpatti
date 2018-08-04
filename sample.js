function change_contet_state(message,currentState){


	console.log('inputParams for the contest:::'+message.contestId+' for the currentState:::'+currentState+' are:::'+JSON.stringify(message))
		
	if(currentState == 'OPEN'){

		if(message.type == 'JOIN'){

			set_contest_state(message.contestId,'REGISTERING',(err)=>{

				if(!err){

					post_contest_state_change(message.contestId,
						'OPEN',
						'REGISTERING'
					)
				}	
			})
		}

	}else if(currentState == 'REGISTERING'){

		if(message.type == 'JOIN'){
			
			set_contest_state(message.contestId,'STARTING',(err)=>{

				if(!err){

					post_contest_state_change(message.contestId,
						'REGISTERING',
						'STARTING'
					)
				}	
			})
		}else if(message.type == 'WITHDRAW'){

			set_contest_state(message.contestId,'OPEN',(err)=>{

				if(!err){


					post_contest_state_change(message.contestId,
						'REGISTERING',
						'OPEN'
					)
				}	
			})

		}else if(message.type == 'STARTGAME'){

			set_contest_state(message.contestId,'STARTING',(err)=>{

				if(!err){

					post_contest_state_change(message.contestId,
						'REGISTERING',
						'STARTING'
					)
				}	
			})

		}
	}else if(currentState == 'STARTING'){

		if(message.type =='STARTGAME'){

			set_contest_state(message.contestId,'PROGRESS',(err)=>{

				if(!err){

					post_contest_state_change(message.contestId,
						'STARTING',
						'PROGRESS'
					)
				}	
			})
		}

	}else if(currentState == 'PROGRESS'){

		if(message.type =='GAMEEND'){

			get_contest_round(message.contestId,(round)=>{

				increment_current_round_game_finish_count(message.contestId,round,(count)=>{

					if(count == 2){

						if(round == noOfRounds){

							set_contest_state(message.contestId,'CONTESTEND',(err)=>{

								if(!err){

									post_contest_state_change(message.contestId,
										'PROGRESS',
										'CONTESTEND'
									)
								}	
							})

						}else{
							set_contest_state(message.contestId,'BREAK',(err)=>{

								if(!err){

									post_contest_state_change(message.contestId,
										'PROGRESS',
										'BREAK'
									)
								}	
							})	
						}
					}
				})	
			})
		}else if(message.type == 'ROUNDFINISH'){
			get_contest_round(message.contestId,(round)=>{

				if(round == noOfRounds){

					set_contest_state(message.contestId,'CONTESTEND',(err)=>{

						if(!err){

							post_contest_state_change(message.contestId,
								'PROGRESS',
								'CONTESTEND'
							)
						}	
					})
				}else{

					set_contest_state(message.contestId,'BREAK',(err)=>{

						if(!err){

							post_contest_state_change(message.contestId,
								'PROGRESS',
								'BREAK'
							)
						}	
					})
				}
			})
		}
	}else if(currentState == 'BREAK'){

		if(message.type =='STARTGAME'){

			set_contest_state(message.contestId,'STARTING',(err)=>{

				if(!err){

					post_contest_state_change(message.contestId,
						'BREAK',
						'STARTING'
					)
				}	
			})
		}

	}else if(currentState == 'CONTESTEND'){

		
	}
}
function post_contest_state_change(contestId,userId,loginName,previousState,currentState){

	console.log(previousState+":::state:::"
		+currentState
		+":::contestId:::"
		+contestId
	)
	if(previousState == 'OPEN' && currentState == 'JOINED'){

		
	}else if(previousState == 'JOINED' && currentState == 'STARTING'){

		
	}else if(previousState == 'STARTING' && currentState == 'PROGRESS'){

		
	}else if(previousState == 'PROGRESS' && currentState == 'CONTESTEND'){

		
	}
}
