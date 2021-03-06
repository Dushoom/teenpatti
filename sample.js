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
function add_contest_user(contestId,userId) {

	redis_client.sadd(userId+"_myContest",contestId,(err,resp)=>{

		console.log(contestId+":: added to the contest "+userId)
	})
	// body...
}
function deduct_money(contestId,userId,callback){

	get_contest_templateId(contestId,(err,contestTemplateId)=>{

		if(err){


		}else{

			get_contest_template_object(contestTemplateId,(err,templateDetailsObject)=>{

				console.log('templateObject '+templateDetailsObject)
				if(err){

				}else{

					console.log('funds')
					params = {

					'contestId':contestId,
					'prizeType':2,
					'userId':userId,
					'entryFee':templateDetailsObject['entry_fee'],
					'maxBonus':templateDetailsObject['bonus_entree_fee_percent'],
					'channelId':1
					}
					
					fmInstance.post('/fs/api/bricks/join',params)
					.then((fmResponse) =>{

						console.log(fmResponse.data)
						callback(!fmResponse.data.error)
					})
					.catch((err)=>{


						
					})
				}
			})
		}
	})
}
function set_contest_user_state(contestId,userId,state){

	redis_client.set([contestId+"_"+userId+"_state",state])
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
function chanage_contest_user_state(inputParams,currentState){

	for(key in inputParams){

		console.log(key+":::"+inputParams[key])
	}
	console.log('currentState:::'+currentState)
	if(currentState == null){


		if(inputParams.type == 1){

	
			check_basic_contest_player_checks(parseInt(JSON.parse(inputParams.contestId)),(err)=>{

				console.log('contest err '+err)
				if(!err){

					deduct_money(parseInt(JSON.parse(inputParams.contestId)),inputParams.user_id,(isDeducted)=>{

						console.log(isDeducted)
						if(isDeducted){
							
							set_contest_user_state(parseInt(JSON.parse(inputParams.contestId)),inputParams.user_id,'Joined')
							console.log(parseInt(JSON.parse(inputParams.contestId)),inputParams.user_id,inputParams.login_name,currentState,'Joined')
							post_contest_user_state_change(parseInt(JSON.parse(inputParams.contestId)),inputParams.user_id,inputParams.login_name,currentState,'Joined')
						}else{

							console.log('UserId::'+inputParams.user_id+"::doesn't have required funds to join")
						}
					})
				}else{

					console.log('contestId '+parseInt(JSON.parse(inputParams.contestId))+' is not available wait sometime for the other contest to start' )
				}

			})
		}else {

			invalid_state(inputParams,currentState)
			console.log('Invalid input for the currentState '+currentState)
		}
	}else if(currentState == 'Joined'){

		if(inputParams.type == 102){

			set_contest_user_state(inputParams.contestId,inputParams.userId,'Starting')
			post_contest_user_state_change(inputParams.contestId,inputParams.userId,inputParams.login_name,currentState,'Starting')
		}else{

			invalid_state(inputParams,currentState)
			console.log('Invalid input for the currentState '+currentState)
		}
	}else if(currentState == 'Starting'){

		console.log(inputParams)
		if(inputParams.type == 2 || inputParams.type == 103){

			if(inputParams.type ==2){

			set_contest_user_state(parseInt(JSON.parse(inputParams.contestId)),parseInt(inputParams.user_id),'Progress')
			post_contest_user_state_change(parseInt(JSON.parse(inputParams.contestId)),parseInt(inputParams.user_id),inputParams.login_name,'Starting','Progress')
			}else {

			set_contest_user_state(inputParams.contestId,inputParams.userId,'Progress')
			post_contest_user_state_change(inputParams.contestId,inputParams.userId,inputParams.login_name,'Starting','Progress')
			}
			
			
		}else{

			invalid_state(inputParams,currentState)
			console.log('Invalid input for the currentState '+currentState)
		}
	}else if(currentState == 'Progress'){

		if(inputParams.type == 5 || inputParams.type == 104){

			redis_client.get(inputParams.gameId+"_"+inputParams.playerId+"_contest",(err,contestId)=>{

				if(err){



				}else{

					redis_client.get(contestId+"_"+inputParams.user_id+"_gameCount",(err,contestPlayerGameCount)=>{

						console.log(contestId+"_"+inputParams.user_id+"_gameCount")
						console.log(contestPlayerGameCount+'contestPlayerGameCount'+contestId)
						if(parseInt(contestPlayerGameCount) >= 2 && typeof inputParams.user_id != 'undefined'){
							set_contest_user_state(contestId,inputParams.user_id,'ContestEnd')
							post_contest_user_state_change(contestId,inputParams.user_id,inputParams.login_name,'Progress','ContestEnd')
						}
						else if(typeof inputParams.user_id != 'undefined'){

							set_contest_user_state(contestId,inputParams.user_id,'Break')
							post_contest_user_state_change(contestId,inputParams.user_id,inputParams.login_name,'Progress','Break')	
						}
					})
				}
			})
		}else{

			console.log('Invalid input for the currentState '+currentState)
			invalid_state(inputParams,currentState)

		}
	}else if(currentState == 'Break'){

		if(inputParams.type == 105){

			set_contest_user_state(inputParams.contestId,inputParams.userId,'Starting')
			post_contest_user_state_change(inputParams.contestId,inputParams.userId,inputParams.login_name,currentState,'Starting')
			
		}else{

			console.log('Invalid input for the currentState '+currentState)
			invalid_state(inputParams,currentState)
		}
	}else if(currentState == 'ContestEnd'){

		invalid_state(inputParams,currentState)

		console.log('contest ended')
	}
}
function post_contest_user_state_change(contestId,userId,loginName,previousState,currentState){

	console.log(previousState+"::::::state:::::"+currentState+"::::::login_name::::"+loginName+"::::::contestId"+contestId)
	if(previousState == null && currentState == 'Joined'){


		message = {

			'type':1,
			'nPreminoType':99,
			'nScoreMoveCount':40,
			'gameId':-1,
			'playerId':-1,
			'score_ref':scoreRef,
			'presetColor':{"r":46.0,"g":46.0,"b":46.0,"a":1.0},
			'shapes':get_shapes(),
			'pingTime':2000,
			'sendTime':250,
			'retryTime':1000,
			'pingFailCount':3,
			'nTimeToStart':3000,
			'nBreakTime':10000,
			'nOfGames':2,
			'state':JSON.stringify({'type':3,'nTimeToStart':3000})
		}
		add_contest_user(contestId,userId)
		increment_contest_player_count(contestId,(playerCount)=>{


			console.log('playerCount:::contestId:::'+contestId+'::::'+playerCount)
		})
		initialte_contest_user_score(contestId,userId,loginName)
		inintialize_contest_player_game_count(contestId,userId)
		send_message_to_cs(contestId,userId,message)
		params = {'type':102,'contestId':contestId,'userId':userId,'login_name':loginName}
		chanage_contest_user_state(params,currentState)
		

	}else if(previousState == 'Joined' && currentState == 'Starting'){

		set_start_game_timer(contestId,userId,loginName,3000,(hash)=>{
			
			console.log(hash)
		})	
	}else if(previousState == 'Starting' && currentState == 'Progress'){


		start_game(parseInt(contestId),parseInt(userId),loginName,(err,gameId,playerId)=>{

			if(!err){
				
				redis_client.set([contestId+"_"+userId+"_currentPlaying",gameId+":"+playerId])
				initiate_game_player_score(gameId,playerId,contestId,gameId)
				add_gameplayer_to_contest(contestId,userId,gameId,playerId)
				set_end_game_timer(gameId,playerId,contestId,userId,loginName,gameDuration+bufferTime,(hash)=>{


				})	
			}
		})
		//send game start message here.
		
	}else if(previousState == 'Progress' && currentState =='Break'){

		increment_contest_player_game_count(contestId,userId)
		end_game(contestId,userId,loginName,()=>{

			console.log('contest game ended')
		})

	}else if(previousState == 'Progress' && currentState == 'ContestEnd'){


		end_contest(contestId,userId)

	}else if(previousState == 'Break' && currentState == 'Starting'){

		redis_client.get(contestId+"_"+userId+"_gameCount",(err,contestPlayerGameCount)=>{

			if(contestPlayerGameCount >2){

				console.log('bug in the code')
				set_contest_user_state(contestId,userId,'ContestEnd')
			}else{

				set_start_game_timer(contestId,userId,loginName,5000,(hash)=>{
			
					console.log(hash)
				})
			}
		})
	}

}